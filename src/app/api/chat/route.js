import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SPACES = {
  emotion:    process.env.NEXT_PUBLIC_EMOTION_SPACE_URL,
  topic:      process.env.NEXT_PUBLIC_TOPIC_SPACE_URL,
  distortion: process.env.NEXT_PUBLIC_DISTORTION_SPACE_URL,
  // stress space takes structured form fields, not free text — skip here
};

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
function runSpaces(text, budgetMs = 16_000) {
  const timeout = new Promise((resolve) =>
    setTimeout(() => resolve([null, null, null]), budgetMs)
  );

  const work = Promise.all([
    callSpace(SPACES.emotion,    { text }),
    callSpace(SPACES.topic,      { text }),
    callSpace(SPACES.distortion, { text, threshold: 0.005 }),
  ]);

  return Promise.race([work, timeout]);
}

/* ───────────────────────────────────────────────
   System prompt
─────────────────────────────────────────────── */
const BASE_SYSTEM = `You are Coalitus, an empathetic AI assistant.

- Be warm, clear, and supportive
- Keep responses concise
- Never diagnose
- Provide crisis resources if needed`;

/* ───────────────────────────────────────────────
   Build a context block from the space results
   so the LLM is aware of the analysis
─────────────────────────────────────────────── */
function buildAnalysisContext(emotion, topic, distortion) {
  const lines = [];

  if (emotion?.top_label) {
    lines.push(
      `Detected emotion: ${emotion.top_pretty} ${emotion.top_emoji} (${emotion.confidence.toFixed(1)}% confidence)`
    );
  }

  if (topic?.top_label) {
    lines.push(
      `Mental health topic: ${topic.top_pretty} (${topic.confidence.toFixed(1)}% confidence)`
    );
    if (topic.is_crisis) {
      lines.push("⚠️ Crisis language detected — provide crisis resources.");
    }
  }

  if (distortion?.any_detected && distortion.detected?.length) {
    const names = distortion.detected.map((d) => d.pretty).join(", ");
    lines.push(`Cognitive distortions detected: ${names}`);
  }

  return lines.length
    ? `[Analysis]\n${lines.join("\n")}\n`
    : "";
}

/* ───────────────────────────────────────────────
   ROUTE
─────────────────────────────────────────────── */
export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!messages?.length) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    const lastUserText =
      [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

    const [emotion, topic, distortion] = await runSpaces(lastUserText);

    const analysisContext = buildAnalysisContext(emotion, topic, distortion);

    const systemPrompt = analysisContext
      ? `${BASE_SYSTEM}\n\n${analysisContext}`
      : BASE_SYSTEM;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    const content =
      completion.choices?.[0]?.message?.content || "I'm here. Tell me more.";

    return NextResponse.json({
      content,
      analysis: {
        // Emotion: top label + full breakdown
        emotion: emotion
          ? {
              top_label:  emotion.top_label,
              top_pretty: emotion.top_pretty,
              top_emoji:  emotion.top_emoji,
              confidence: emotion.confidence,
              breakdown:  emotion.emotions ?? [],
            }
          : null,

        // Topic: top label + crisis flag + full breakdown
        topic: topic
          ? {
              top_label:   topic.top_label,
              top_pretty:  topic.top_pretty,
              top_emoji:   topic.top_emoji,
              confidence:  topic.confidence,
              is_crisis:   topic.is_crisis,
              breakdown:   topic.categories ?? [],
            }
          : null,

        // Distortion: detected items + all raw scores
        distortion: distortion
          ? {
              any_detected: distortion.any_detected,
              detected:     distortion.detected ?? [],
              all_scores:   distortion.all_scores ?? [],
            }
          : null,
      },
    });
  } catch (err) {
    console.error("[/api/chat]", err);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}