/**
 * app/api/triage/route.js
 */

import { NextResponse } from "next/server";

const SPACES = {
  emotion:    process.env.NEXT_PUBLIC_EMOTION_SPACE_URL,
  topic:      process.env.NEXT_PUBLIC_TOPIC_SPACE_URL,
  distortion: process.env.NEXT_PUBLIC_DISTORTION_SPACE_URL,
};

const CRISIS_RE =
  /\b(suicid|end\s+my\s+life|kill\s+myself|want\s+to\s+die|self.harm|hurt\s+myself|no\s+reason\s+to\s+live)\b/i;

/* ── Single-attempt, fast-fail space call ────────────────── */
async function callSpace(baseUrl, text) {
  if (!baseUrl) return null;

  // Gradio 4.x uses /gradio_api/run/predict; Gradio 5.x moved to /run/predict
  const paths = ["/gradio_api/run/predict", "/run/predict"];

  for (const path of paths) {
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ data: [text] }),
        signal:  AbortSignal.timeout(5_000),
      });
      if (res.status === 404) continue;        // wrong Gradio version path — try next
      if (!res.ok) {
        console.warn(`[callSpace] ${baseUrl}${path} → HTTP ${res.status}`);
        return null;                           // real error — stop trying
      }
      const json = await res.json();
      return json?.data ?? null;
    } catch (err) {
      console.warn(`[callSpace] ${baseUrl}${path} →`, err?.message);
    }
  }

  console.warn(`[callSpace] ${baseUrl} → no working path found`);
  return null;
}

/* ── Shared budget across all 3 spaces ───────────────────── */
function runSpaces(text, budgetMs = 5_000) {
  const fallback = new Promise((resolve) =>
    setTimeout(() => resolve([null, null, null]), budgetMs)
  );
  const work = Promise.all([
    callSpace(SPACES.emotion,    text),
    callSpace(SPACES.topic,      text),
    callSpace(SPACES.distortion, text),
  ]);
  return Promise.race([work, fallback]);
}

/* ── Score helpers ───────────────────────────────────────── */
function normalizeScores(raw) {
  if (!raw || typeof raw !== "object") return {};
  const out = {};
  for (const [key, val] of Object.entries(raw)) {
    if (typeof val !== "number") continue;
    const clean = key
      .replace(/^[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}\s]+/gu, "")
      .trim().toLowerCase().replace(/\s+/g, "_");
    if (clean) out[clean] = val;
  }
  return out;
}

function getTop(scores) {
  const entries = Object.entries(scores ?? {});
  if (!entries.length) return null;
  return entries.reduce((best, cur) => (cur[1] > best[1] ? cur : best));
}

/* ── POST /api/triage ────────────────────────────────────── */
export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!text?.trim()) {
      return NextResponse.json({ error: "text required" }, { status: 400 });
    }

    const [emotionRaw, topicRaw, distortionRaw] = await runSpaces(text);

    const emotionScores    = normalizeScores(emotionRaw?.[2]    ?? emotionRaw?.[0]);
    const topicScores      = normalizeScores(topicRaw?.[2]      ?? topicRaw?.[0]);
    const distortionScores = normalizeScores(distortionRaw?.[2] ?? distortionRaw?.[1] ?? distortionRaw?.[0]);

    const topEmote = getTop(emotionScores);
    const topTopic = getTop(topicScores);

    const detectedDistortions = Object.entries(distortionScores)
      .filter(([, v]) => v >= 0.45)
      .sort((a, b) => b[1] - a[1])
      .map(([label, confidence]) => ({ label, confidence }));

    const crisis = CRISIS_RE.test(text) || topTopic?.[0] === "suicide";

    return NextResponse.json({
      emotion:    topEmote ? { label: topEmote[0], confidence: topEmote[1] } : null,
      topic:      topTopic ? { label: topTopic[0], confidence: topTopic[1] } : null,
      distortion: { has_distortions: detectedDistortions.length > 0, detected: detectedDistortions },
      crisis,
    });
  } catch (err) {
    console.error("[/api/triage]", err);
    return NextResponse.json({ error: "Triage unavailable." }, { status: 500 });
  }
}