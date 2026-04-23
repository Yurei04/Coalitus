"use client";

import { useState } from "react";
import {
  FlaskConical, AlertTriangle, CheckCircle2,
  Heart, MessageSquare, Brain, Loader2,
} from "lucide-react";
import { API_SPACE_URL } from "@/lib/constants";

/* ─── data maps ─────────────────────────────────────────── */
const URGENCY_MAP = { fear: 3, sadness: 2, anger: 2, surprise: 1, love: 0, joy: 0 };
const TOPIC_PRIORITY = {
  suicide: 5, depression: 4, trauma: 4, anxiety: 3, grief: 3,
  anger: 2, self_esteem: 2, relationship: 2, family: 2, sleep_issues: 1, general_support: 1,
};
const PRIORITY_META = {
  5: { label: "CRITICAL — Escalate Now", color: "#ef4444", bg: "rgba(239,68,68,0.08)"  },
  4: { label: "High Priority",           color: "#ef4444", bg: "rgba(239,68,68,0.06)"  },
  3: { label: "Medium-High",             color: "#fb923c", bg: "rgba(251,146,60,0.07)" },
  2: { label: "Medium",                  color: "#fbbf24", bg: "rgba(251,191,36,0.07)" },
  1: { label: "Low",                     color: "#39ff8e", bg: "rgba(57,255,142,0.06)" },
  0: { label: "Low",                     color: "#39ff8e", bg: "rgba(57,255,142,0.06)" },
};
const EXAMPLES = [
  "I can't sleep and keep thinking I'm worthless. Nothing will ever get better.",
  "My partner left me. I feel completely lost and don't know how to go on.",
  "I've been really anxious lately — my heart races and I can't focus.",
  "I keep thinking about hurting myself. I don't see the point anymore.",
  "My family keeps fighting and home is unbearable. I always ruin everything.",
];

/* ─── Result card ────────────────────────────────────────── */
function ResultCard({ label, emoji, value, sub, color, Icon }) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-1"
      style={{
        background: `${color}07`,
        border: `1px solid ${color}22`,
      }}
    >
      <p
        className="text-[9px] uppercase tracking-[0.2em] mb-2"
        style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.22)" }}
      >
        {label}
      </p>
      <Icon size={18} style={{ color, opacity: 0.7 }} strokeWidth={1.5} />
      <p
        className="text-sm font-bold capitalize mt-1"
        style={{ fontFamily: "'Syne', sans-serif", color: "rgba(255,255,255,0.82)" }}
      >
        {value ?? "—"}
      </p>
      {sub && (
        <p
          className="text-[11px]"
          style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.25)" }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/* ─── TriageView ─────────────────────────────────────────── */
export function TriageView() {
  const [text,    setText]    = useState("");
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function runTriage(input) {
    const trimmed = (input ?? text).trim();
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
      setError("Could not reach the API. Make sure the Hugging Face Space is awake.");
    } finally {
      setLoading(false);
    }
  }

  const priority = result
    ? Math.min(5, result.crisis ? 5 : Math.max(
        URGENCY_MAP[result.emotion?.label] ?? 0,
        TOPIC_PRIORITY[result.topic?.label] ?? 0,
      ))
    : null;

  const pMeta = priority !== null ? PRIORITY_META[priority] : null;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');`}</style>

      <div
        className="flex-1 overflow-y-auto p-6"
        style={{ background: "rgba(0,9,29,0.98)" }}
      >
        <div className="max-w-2xl mx-auto space-y-5">

          {/* heading */}
          <div>
            <h2
              className="text-xl font-extrabold mb-1 flex items-center gap-2"
              style={{
                fontFamily: "'Syne', sans-serif",
                background: "linear-gradient(135deg,#d1fae5,#86efac)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <FlaskConical size={20} style={{ color: "#39ff8e" }} strokeWidth={1.6} />
              Triage Tool
            </h2>
            <p
              className="text-sm"
              style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.25)" }}
            >
              Paste a client message to get priority level, emotion, topic, and CBT distortion pre-read.
            </p>
          </div>

          {/* input card */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); runTriage(); }
              }}
              rows={4}
              placeholder="Describe the client's situation…"
              className="w-full resize-none outline-none text-sm leading-relaxed px-5 py-4"
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.7)",
                caretColor: "#39ff8e",
                fontFamily: "inherit",
                display: "block",
              }}
            />

            {/* bottom toolbar */}
            <div
              className="flex items-center justify-between px-5 py-3 flex-wrap gap-2"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* example buttons */}
              <div className="flex gap-1.5 flex-wrap">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => runTriage(ex)}
                    className="text-[10px] px-2.5 py-1 rounded-lg transition-colors duration-150"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      background: "rgba(57,255,142,0.05)",
                      color: "rgba(57,255,142,0.45)",
                      border: "1px solid rgba(57,255,142,0.12)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = "#39ff8e";
                      e.currentTarget.style.borderColor = "rgba(57,255,142,0.3)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = "rgba(57,255,142,0.45)";
                      e.currentTarget.style.borderColor = "rgba(57,255,142,0.12)";
                    }}
                  >
                    eg {i + 1}
                  </button>
                ))}
              </div>

              {/* run button */}
              <button
                onClick={() => runTriage()}
                disabled={loading || !text.trim()}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  background: loading || !text.trim() ? "rgba(255,255,255,0.04)" : "rgba(57,255,142,0.12)",
                  color:      loading || !text.trim() ? "rgba(255,255,255,0.18)" : "#39ff8e",
                  border:     `1px solid ${loading || !text.trim() ? "rgba(255,255,255,0.07)" : "rgba(57,255,142,0.3)"}`,
                  cursor:     loading || !text.trim() ? "not-allowed" : "pointer",
                  boxShadow:  !loading && text.trim() ? "0 0 12px rgba(57,255,142,0.12)" : "none",
                }}
              >
                {loading && <Loader2 size={13} className="animate-spin" />}
                {loading ? "Analysing…" : "Run Triage →"}
              </button>
            </div>
          </div>

          {/* error */}
          {error && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
              }}
            >
              <AlertTriangle size={14} strokeWidth={1.8} />
              {error}
            </div>
          )}

          {/* results */}
          {result && pMeta && (
            <div className="space-y-4">

              {/* priority banner */}
              <div
                className="px-5 py-4 rounded-xl"
                style={{ background: pMeta.bg, border: `1px solid ${pMeta.color}35` }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: pMeta.color, boxShadow: `0 0 8px ${pMeta.color}` }}
                  />
                  <span
                    className="text-sm font-bold"
                    style={{ fontFamily: "'Syne', sans-serif", color: pMeta.color }}
                  >
                    {pMeta.label}
                  </span>
                </div>

                {result.crisis && (
                  <div
                    className="mt-3 text-sm space-y-1"
                    style={{ fontFamily: "'Space Mono', monospace", color: "#fca5a5" }}
                  >
                    <p className="font-bold">⚡ Crisis indicators — escalate immediately</p>
                    <p>988 Suicide &amp; Crisis Lifeline — call or text <strong>988</strong></p>
                    <p>Crisis Text Line — text HOME to <strong>741741</strong></p>
                  </div>
                )}
              </div>

              {/* 3-col result cards */}
              <div className="grid grid-cols-3 gap-3">
                <ResultCard
                  label="Emotion"
                  Icon={Heart}
                  color="#39ff8e"
                  value={result.emotion?.label}
                  sub={result.emotion ? `${(result.emotion.confidence * 100).toFixed(1)}% confidence` : undefined}
                />
                <ResultCard
                  label="Topic"
                  Icon={MessageSquare}
                  color="#22d3ee"
                  value={result.topic?.label?.replace(/_/g, " ")}
                  sub={result.topic ? `${(result.topic.confidence * 100).toFixed(1)}% confidence` : undefined}
                />
                <ResultCard
                  label="Distortions"
                  Icon={Brain}
                  color="#a3e635"
                  value={
                    result.distortion?.has_distortions
                      ? `${result.distortion.detected.length} found`
                      : "None detected"
                  }
                  sub={
                    result.distortion?.has_distortions
                      ? result.distortion.detected.map(d => d.label.replace(/_/g, " ")).join(", ")
                      : undefined
                  }
                />
              </div>

              {/* counselor pre-read */}
              <div
                className="rounded-xl px-5 py-4"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(57,255,142,0.14)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={13} style={{ color: "#39ff8e" }} strokeWidth={1.8} />
                  <p
                    className="text-[10px] uppercase tracking-[0.2em]"
                    style={{ fontFamily: "'Space Mono', monospace", color: "rgba(57,255,142,0.55)" }}
                  >
                    Counselor Pre-Read
                  </p>
                </div>

                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>
                  Client presents with{" "}
                  <span style={{ color: "rgba(255,255,255,0.8)" }}>
                    {result.emotion?.label ?? "unknown"} affect
                  </span>{" "}
                  and is seeking support around{" "}
                  <span style={{ color: "rgba(255,255,255,0.8)" }}>
                    {result.topic?.label?.replace(/_/g, " ") ?? "general concerns"}
                  </span>.
                  {result.distortion?.has_distortions && (
                    <> CBT note: possible{" "}
                      <span style={{ color: "rgba(255,255,255,0.8)" }}>
                        {result.distortion.detected.map(d => d.label.replace(/_/g, " ")).join(", ")}
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
    </>
  );
}