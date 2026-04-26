import { NextResponse } from "next/server";

const SPACES = {
  emotion:    process.env.NEXT_PUBLIC_EMOTION_SPACE_URL,
  topic:      process.env.NEXT_PUBLIC_TOPIC_SPACE_URL,
  distortion: process.env.NEXT_PUBLIC_DISTORTION_SPACE_URL,
};

const CRISIS_RE =
  /\b(suicid|end\s+my\s+life|kill\s+myself|want\s+to\s+die|self.harm|hurt\s+myself|no\s+reason\s+to\s+live)\b/i;

/* ───────────────────────────────────────────────
   Call a FastAPI space — simple POST /predict
─────────────────────────────────────────────── */
async function callSpace(baseUrl, body, timeoutMs = 10_000) {
  if (!baseUrl) return null;
  try {
    const res = await fetch(`${baseUrl}/predict`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
      signal:  AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) {
      console.warn(`[callSpace] ${baseUrl} → HTTP ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`[callSpace] ${baseUrl} →`, err?.message);
    return null;
  }
}

/* ───────────────────────────────────────────────
   Run all spaces in parallel with a shared budget
─────────────────────────────────────────────── */
function runSpaces(text, budgetMs = 14_000) {
  const fallback = new Promise((resolve) =>
    setTimeout(() => resolve([null, null, null]), budgetMs)
  );

  const work = Promise.all([
    callSpace(SPACES.emotion,    { text }),
    callSpace(SPACES.topic,      { text }),
    callSpace(SPACES.distortion, { text, threshold: 0.005 }),
  ]);

  return Promise.race([work, fallback]);
}

/* ───────────────────────────────────────────────
   POST /api/triage
─────────────────────────────────────────────── */
export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "text required" }, { status: 400 });
    }

    const [emotion, topic, distortion] = await runSpaces(text);

    // ── Emotion ──────────────────────────────────────────────────────────────
    // Response shape: { top_label, top_pretty, top_emoji, confidence, emotions[] }
    const emotionResult = emotion?.top_label
      ? { label: emotion.top_label, pretty: emotion.top_pretty, emoji: emotion.top_emoji, confidence: emotion.confidence }
      : null;

    // ── Topic ─────────────────────────────────────────────────────────────────
    // Response shape: { top_label, top_pretty, top_emoji, confidence, is_crisis, categories[] }
    const topicResult = topic?.top_label
      ? { label: topic.top_label, pretty: topic.top_pretty, emoji: topic.top_emoji, confidence: topic.confidence }
      : null;

    // ── Distortion ────────────────────────────────────────────────────────────
    // Response shape: { any_detected, threshold, detected[], all_scores[] }
    // detected items: { label, pretty, emoji, description, score, detected }
    const detectedDistortions = (distortion?.detected ?? []).map((d) => ({
      label:      d.label,
      pretty:     d.pretty,
      confidence: d.score,
    }));

    // ── Crisis ────────────────────────────────────────────────────────────────
    // Triggered by keyword regex OR the topic classifier labelling it as suicide
    // OR the topic classifier's own is_crisis flag
    const crisis =
      CRISIS_RE.test(text) ||
      topic?.top_label === "suicide" ||
      topic?.is_crisis === true;

    return NextResponse.json({
      emotion:   emotionResult,
      topic:     topicResult,
      distortion: {
        has_distortions: distortion?.any_detected ?? false,
        detected:        detectedDistortions,
      },
      crisis,
    });
  } catch (err) {
    console.error("[/api/triage]", err);
    return NextResponse.json({ error: "Triage unavailable." }, { status: 500 });
  }
}