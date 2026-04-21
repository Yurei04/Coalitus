"use client";

import { useState } from "react";
import { API_SPACE_URL } from "@/lib/constants";

const URGENCY_MAP = { fear: 3, sadness: 2, anger: 2, surprise: 1, love: 0, joy: 0 };
const TOPIC_PRIORITY = {
  suicide: 5, depression: 4, trauma: 4, anxiety: 3, grief: 3,
  anger: 2, self_esteem: 2, relationship: 2, family: 2, sleep_issues: 1, general_support: 1,
};
const PRIORITY_META = {
  5: { label: "CRITICAL — Escalate Now", color: "#ef4444" },
  4: { label: "High Priority",           color: "#ef4444" },
  3: { label: "Medium-High",             color: "#fb923c" },
  2: { label: "Medium",                  color: "#facc15" },
  1: { label: "Low",                     color: "#4ade80" },
  0: { label: "Low",                     color: "#4ade80" },
};
const TOPIC_EMOJI = {
  anger: "😤", anxiety: "😰", depression: "💙", family: "👨‍👩‍👧",
  general_support: "🤝", grief: "🕊️", relationship: "💔",
  self_esteem: "🪞", sleep_issues: "😴", suicide: "🆘", trauma: "🌱",
};
const EMOTION_EMOJI = {
  sadness: "😢", anger: "😠", love: "❤️", surprise: "😲", fear: "😨", joy: "😄",
};
const DISTORTION_EMOJI = {
  overgeneralization: "🔁", catastrophizing: "💥",
  black_and_white: "⚫⚪", self_blame: "👤", mind_reading: "🔮",
};
const EXAMPLES = [
  "I can't sleep and I keep thinking I'm worthless. Nothing will ever get better.",
  "My partner left me. I feel completely lost and don't know how to go on.",
  "I've been really anxious lately — my heart races and I can't focus.",
  "I keep thinking about hurting myself. I don't see the point anymore.",
  "My family keeps fighting and home is unbearable. I always ruin everything.",
];

const card = {
  background: "rgba(22,24,28,0.98)",
  border: "1px solid rgba(74,222,128,0.12)",
  borderRadius: 14,
  padding: "20px",
};

export function TriageView() {
  const [text, setText]     = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  async function runTriage(input) {
    const trimmed = input.trim();
    if (!trimmed) return;
    setText(trimmed);
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${API_SPACE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, distortion_threshold: 0.5 }),
      });
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch {
      setError("Could not reach the API Space. Make sure it's deployed and awake.");
    } finally {
      setLoading(false);
    }
  }

  const priority = result
    ? Math.min(5, result.crisis ? 5 : Math.max(
        URGENCY_MAP[result.emotion?.label] ?? 0,
        TOPIC_PRIORITY[result.topic?.label] ?? 0
      ))
    : null;

  const pMeta = priority !== null ? PRIORITY_META[priority] : null;

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ background: "#0a0a0b" }}>
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Header */}
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "#d1fae5" }}>
            🏥 Counseling Triage Tool
          </h2>
          <p className="text-sm mt-1" style={{ color: "#52525b" }}>
            Paste a client message to get priority level, emotion, topic, and a distortion pre-read instantly.
          </p>
        </div>

        {/* Input card */}
        <div style={card}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); runTriage(text); } }}
            rows={4}
            placeholder="Describe the client's situation…"
            className="w-full resize-none text-sm outline-none"
            style={{ background: "transparent", color: "#e4e4e7", caretColor: "#4ade80" }}
          />
          <div className="flex items-center justify-between mt-3 pt-3 flex-wrap gap-2"
            style={{ borderTop: "1px solid rgba(74,222,128,0.1)" }}>
            <div className="flex gap-2 flex-wrap">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => runTriage(ex)}
                  className="text-xs px-2.5 py-1 rounded-lg transition-all"
                  style={{ background: "rgba(74,222,128,0.06)", color: "rgba(74,222,128,0.6)", border: "1px solid rgba(74,222,128,0.15)" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#4ade80"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "rgba(74,222,128,0.6)"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.15)"; }}
                >
                  Example {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => runTriage(text)}
              disabled={loading || !text.trim()}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: loading || !text.trim() ? "rgba(74,222,128,0.06)" : "rgba(74,222,128,0.18)",
                color:      loading || !text.trim() ? "rgba(74,222,128,0.3)"  : "#4ade80",
                border: "1px solid rgba(74,222,128,0.3)",
              }}
            >
              {loading ? "Analysing…" : "Run Triage →"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm px-4 py-3 rounded-xl"
            style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
            ⚠ {error}
          </p>
        )}

        {/* Results */}
        {result && pMeta && (
          <div className="space-y-4">

            {/* Priority banner */}
            <div className="px-5 py-4 rounded-2xl" style={{
              background: `${pMeta.color}14`,
              border: `1px solid ${pMeta.color}40`,
              boxShadow: `0 0 20px ${pMeta.color}10`,
            }}>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full animate-pulse"
                  style={{ background: pMeta.color, boxShadow: `0 0 8px ${pMeta.color}` }} />
                <span className="text-base font-semibold" style={{ color: pMeta.color }}>
                  {pMeta.label}
                </span>
              </div>
              {result.crisis && (
                <div className="mt-3 text-sm space-y-1" style={{ color: "#fca5a5" }}>
                  <p className="font-medium">⚡ Crisis detected — escalate immediately</p>
                  <p>🆘 <strong>988 Suicide & Crisis Lifeline</strong> — call or text <strong>988</strong></p>
                  <p>📱 <strong>Crisis Text Line</strong> — text HOME to <strong>741741</strong></p>
                </div>
              )}
            </div>

            {/* 3 result cards */}
            <div className="grid grid-cols-3 gap-4">
              <div style={card}>
                <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(74,222,128,0.5)" }}>Emotion</p>
                <p className="text-2xl mb-1">{EMOTION_EMOJI[result.emotion?.label] ?? "🎭"}</p>
                <p className="text-sm font-semibold capitalize" style={{ color: "#d1fae5" }}>
                  {result.emotion?.label ?? "—"}
                </p>
                <p className="text-xs mt-1" style={{ color: "#52525b" }}>
                  {((result.emotion?.confidence ?? 0) * 100).toFixed(1)}% confidence
                </p>
              </div>

              <div style={card}>
                <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(74,222,128,0.5)" }}>Topic</p>
                <p className="text-2xl mb-1">{TOPIC_EMOJI[result.topic?.label] ?? "💬"}</p>
                <p className="text-sm font-semibold capitalize" style={{ color: "#d1fae5" }}>
                  {result.topic?.label?.replace(/_/g, " ") ?? "—"}
                </p>
                <p className="text-xs mt-1" style={{ color: "#52525b" }}>
                  {((result.topic?.confidence ?? 0) * 100).toFixed(1)}% confidence
                </p>
              </div>

              <div style={card}>
                <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(74,222,128,0.5)" }}>Distortions</p>
                {result.distortion?.has_distortions ? (
                  <div className="space-y-1.5 mt-1">
                    {result.distortion.detected.map((d) => (
                      <div key={d.label} className="flex items-center gap-1.5">
                        <span className="text-sm">{DISTORTION_EMOJI[d.label] ?? "🧠"}</span>
                        <span className="text-xs capitalize" style={{ color: "#a1a1aa" }}>
                          {d.label.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs ml-auto" style={{ color: "rgba(74,222,128,0.6)" }}>
                          {(d.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <p className="text-2xl mb-1">✅</p>
                    <p className="text-xs" style={{ color: "#52525b" }}>None detected</p>
                  </>
                )}
              </div>
            </div>

            {/* Counselor pre-read */}
            <div style={{ ...card, borderColor: "rgba(74,222,128,0.2)" }}>
              <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(74,222,128,0.5)" }}>
                Counselor Pre-Read
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#a1a1aa" }}>
                Client presents with{" "}
                <span style={{ color: "#d1fae5" }}>{result.emotion?.label ?? "unknown"} affect</span>
                {" "}and is seeking support around{" "}
                <span style={{ color: "#d1fae5" }}>{result.topic?.label?.replace(/_/g, " ") ?? "general concerns"}</span>.
                {result.distortion?.has_distortions && (
                  <> CBT note: possible{" "}
                    <span style={{ color: "#d1fae5" }}>
                      {result.distortion.detected.map((d) => d.label.replace(/_/g, " ")).join(", ")}
                    </span>
                    {" "}— may benefit from reframing exercises.
                  </>
                )}
                {result.crisis && (
                  <span style={{ color: "#f87171" }}>
                    {" "}⚡ Crisis indicators detected — immediate escalation recommended.
                  </span>
                )}
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}