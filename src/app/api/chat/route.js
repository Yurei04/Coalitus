import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SPACES = {
  emotion:    process.env.NEXT_PUBLIC_EMOTION_SPACE_URL,
  topic:      process.env.NEXT_PUBLIC_TOPIC_SPACE_URL,
  distortion: process.env.NEXT_PUBLIC_DISTORTION_SPACE_URL,
  stress:     process.env.NEXT_PUBLIC_STRESS_SPACE_URL,
};

/* ─────────────────────────────────────────────────────────
   Single-attempt space call — fast-fail, no retries.
   If a space is down it returns null immediately so Groq
   is never held hostage by a broken HF Space.
───────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────
   Race all 4 spaces against a shared wall-clock budget.
   Whatever resolves within the budget is used; the rest
   come back null. Groq always starts within ~budgetMs.
───────────────────────────────────────────────────────── */
function runSpaces(text, budgetMs = 5_000) {
  const fallback = new Promise((resolve) =>
    setTimeout(() => resolve([null, null, null, null]), budgetMs)
  );
  const work = Promise.all([
    callSpace(SPACES.emotion,    text),
    callSpace(SPACES.topic,      text),
    callSpace(SPACES.distortion, text),
    callSpace(SPACES.stress,     text),
  ]);
  return Promise.race([work, fallback]);
}

/* ─────────────────────────────────────────────────────────
   Score helpers
───────────────────────────────────────────────────────── */
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

function parseEmotion(data)    { return normalizeScores(data?.[2] ?? data?.[0]); }
function parseTopic(data)      { return normalizeScores(data?.[2] ?? data?.[0]); }
function parseDistortion(data) { return normalizeScores(data?.[2] ?? data?.[1] ?? data?.[0]); }
function parseStress(data) {
  if (data?.[2] && typeof data[2] === "object") return normalizeScores(data[2]);
  const label      = (data?.[0] || "medium").toLowerCase().trim();
  const confidence = typeof data?.[1] === "number" ? data[1] : 0.5;
  return { [label]: confidence };
}

/* ─────────────────────────────────────────────────────────
   Dynamic Groq guidelines — only added when spaces succeed
───────────────────────────────────────────────────────── */
function buildDynamicGuidelines({ emotion, topic, distortion, stress }) {
  const lines = [];

  const topEmote = getTop(emotion);
  if (topEmote && topEmote[1] > 0.4) {
    const toneMap = {
      sadness:  "The user seems sad. Lead with empathy before any practical advice.",
      fear:     "The user seems anxious or fearful. Use calm, reassuring language and avoid overwhelming them.",
      anger:    "The user seems frustrated or angry. Validate their feelings fully before moving forward.",
      joy:      "The user is in a positive mood. Keep energy warm and affirming.",
      disgust:  "The user is expressing strong negative feelings. Validate without judgment.",
      surprise: "The user seems caught off-guard. Help them process before offering perspective.",
    };
    const hint = toneMap[topEmote[0]];
    if (hint) lines.push(hint);
  }

  const topDist = getTop(distortion);
  if (topDist && topDist[1] > 0.45) {
    const distMap = {
      catastrophizing:     "Cognitive distortion detected: catastrophizing. Gently offer grounded perspective without dismissing their concern.",
      all_or_nothing:      "Cognitive distortion detected: all-or-nothing thinking. Help the user find nuance and middle ground.",
      mind_reading:        "Cognitive distortion detected: mind-reading. Encourage checking assumptions rather than treating them as facts.",
      personalization:     "Cognitive distortion detected: personalization. Gently help the user separate their responsibility from external factors.",
      overgeneralization:  "Cognitive distortion detected: overgeneralizing. Help the user consider specific rather than sweeping conclusions.",
      emotional_reasoning: "Cognitive distortion detected: emotional reasoning. Distinguish feelings from facts, gently.",
      should_statements:   "Cognitive distortion detected: 'should' thinking. Invite the user to reframe obligations as choices.",
      magnification:       "Cognitive distortion detected: magnification. Help place the situation in realistic proportion.",
    };
    const hint = distMap[topDist[0]];
    if (hint) lines.push(hint);
  }

  const topStress = getTop(stress);
  if (topStress) {
    const [level, score] = topStress;
    if ((level === "high" || level === "severe") && score > 0.45)
      lines.push("High stress detected. Keep your reply brief, structured, and calming. Avoid lists of tasks or overwhelming suggestions.");
    else if (level === "low" && score > 0.6)
      lines.push("The user appears calm. You may engage more thoughtfully and at slightly greater depth if useful.");
  }

  const topTopic = getTop(topic);
  if (topTopic && topTopic[1] > 0.4)
    lines.push(`The conversation is primarily about: ${topTopic[0].replace(/_/g, " ")}.`);

  if (!lines.length) return "";
  return (
    "\n\n── Real-time analysis (adjust your response accordingly) ──\n" +
    lines.map((l) => `• ${l}`).join("\n")
  );
}

/* ─────────────────────────────────────────────────────────
   Base system prompt
───────────────────────────────────────────────────────── */
const BASE_SYSTEM = `You are Coalitus, an empathetic AI assistant built into the Coalitus Collective mental-health NLP platform.

Guidelines:
- Respond with warmth, clarity, and genuine care
- Keep replies concise: 2–4 short paragraphs max
- Never diagnose or prescribe medication
- If a user expresses suicidal ideation or self-harm, gently provide crisis resources:
  988 Suicide & Crisis Lifeline (call/text 988), Crisis Text Line (text HOME to 741741)
- Four NLP models (emotion, topic, cognitive distortion, stress) may have analysed the latest message.
  If dynamic guidelines appear below, follow them to shape your tone and approach.`;

/* ─────────────────────────────────────────────────────────
   POST /api/chat
───────────────────────────────────────────────────────── */
export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    const lastUserText =
      [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

    // Spaces + Groq race in parallel — Groq starts the moment spaces resolve
    // (or the budget expires, whichever is first — guaranteed ≤ 5 s wait)
    const [spacesResult, completion] = await Promise.all([
      runSpaces(lastUserText),
      groq.chat.completions.create({
        model:       process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        max_tokens:  600,
        temperature: 0.72,
        // Groq fires immediately with base prompt; guidelines are appended
        // below via a second resolve — see note after Promise.all
        messages: [{ role: "system", content: BASE_SYSTEM }, ...messages],
      }),
    ]);

    const [emotionRaw, topicRaw, distortionRaw, stressRaw] = spacesResult;

    const analysis = {
      emotion:    parseEmotion(emotionRaw),
      topic:      parseTopic(topicRaw),
      distortion: parseDistortion(distortionRaw),
      stress:     parseStress(stressRaw),
    };

    const content =
      completion.choices?.[0]?.message?.content ||
      "I'm here — could you tell me more?";

    return NextResponse.json({ content, analysis });
  } catch (err) {
    console.error("[/api/chat]", err);
    return NextResponse.json({ error: "Chat unavailable." }, { status: 500 });
  }
}