"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, AlertTriangle, Bot, User } from "lucide-react";
import { useAnalysis } from "@/lib/analysisContext";

const CRISIS_RE =
  /\b(suicid|end\s+my\s+life|kill\s+myself|want\s+to\s+die|self.harm|hurt\s+myself|no\s+reason\s+to\s+live)\b/i;

function CrisisBanner() {
  return (
    <div className="mx-4 mb-3 px-4 py-3 rounded-xl text-sm"
      style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", fontFamily: "'Space Mono',monospace" }}>
      <p className="font-bold mb-1" style={{ color: "#f87171" }}>⚡ Crisis Support — You Are Not Alone</p>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
        988 Suicide &amp; Crisis Lifeline — call or text <strong style={{ color: "#fca5a5" }}>988</strong>
        &nbsp;·&nbsp; Crisis Text Line — text <strong style={{ color: "#fca5a5" }}>HOME</strong> to <strong style={{ color: "#fca5a5" }}>741741</strong>
      </p>
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 px-4 py-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{
          background: isUser ? "rgba(57,255,142,0.1)"  : "rgba(34,211,238,0.1)",
          border:     isUser ? "1px solid rgba(57,255,142,0.25)" : "1px solid rgba(34,211,238,0.25)",
        }}>
        {isUser
          ? <User size={13} style={{ color: "#39ff8e" }} strokeWidth={1.8} />
          : <Bot  size={13} style={{ color: "#22d3ee" }} strokeWidth={1.8} />
        }
      </div>
      <div
        className="max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
        style={{
          background:   isUser ? "rgba(57,255,142,0.07)"  : "rgba(255,255,255,0.04)",
          border:       isUser ? "1px solid rgba(57,255,142,0.18)" : "1px solid rgba(255,255,255,0.07)",
          color:        "rgba(255,255,255,0.78)",
          fontFamily:   "inherit",
          borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
          whiteSpace:   "pre-wrap",
        }}
      >
        {msg.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-2">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.25)" }}>
        <Bot size={13} style={{ color: "#22d3ee" }} strokeWidth={1.8} />
      </div>
      <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px 18px 18px 18px" }}>
        {[0, 150, 300].map((delay) => (
          <span key={delay} className="w-1.5 h-1.5 rounded-full"
            style={{ background: "rgba(34,211,238,0.5)", animation: `bounce 1s ${delay}ms infinite` }} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Transform new FastAPI response shapes into the flat
   { label: score } format that ModelPanel / EmotionBar expect.

   emotion.breakdown  → [{ label, probability }]  → { label: probability }
   topic.breakdown    → [{ label, probability }]  → { label: probability }
   distortion.all_scores → [{ label, score }]     → { label: score }
───────────────────────────────────────────────────────── */
function toFlat(items = [], labelKey = "label", scoreKey = "probability") {
  return Object.fromEntries(
    (items ?? []).map((item) => [item[labelKey], item[scoreKey]])
  );
}

function transformAnalysis(raw) {
  return {
    emotion:    toFlat(raw.emotion?.breakdown,     "label", "probability"),
    topic:      toFlat(raw.topic?.breakdown,       "label", "probability"),
    distortion: toFlat(raw.distortion?.all_scores, "label", "score"),
    stress:     {}, // stress model takes structured form fields, not free text
  };
}

export function ChatView() {
  const [messages, setMessages] = useState([
    {
      role:    "assistant",
      content: "Hi, I'm Coalitus. This is a safe space — whatever's on your mind, I'm here to listen. How are you doing today?",
    },
  ]);
  const [input,      setInput]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [showCrisis, setShowCrisis] = useState(false);

  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);
  const { updateAnalysis, setIsAnalysing } = useAnalysis();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    if (CRISIS_RE.test(text)) setShowCrisis(true);

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError("");
    setIsAnalysing(true);

    try {
      const res = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? `Server error ${res.status}`);
      }

      const data = await res.json();

      // Transform FastAPI structured response → flat { label: score } for ModelPanel
      if (data.analysis) {
        updateAnalysis(transformAnalysis(data.analysis));
      }

      // Show crisis banner if the topic model flagged it
      if (data.analysis?.topic?.is_crisis) setShowCrisis(true);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch (err) {
      setError(
        err?.message?.includes("fetch")
          ? "Could not reach the server. Check your connection."
          : (err?.message ?? "Something went wrong — please try again.")
      );
    } finally {
      setLoading(false);
      setIsAnalysing(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function handleInput(e) {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 140) + "px";
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>

      <div className="flex flex-col h-full" style={{ background: "rgba(0,9,29,0.98)", fontFamily: "'Space Mono', monospace" }}>

        {/* ── header ── */}
        <div className="px-5 py-4 flex items-center gap-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(57,255,142,0.1)", border: "1px solid rgba(57,255,142,0.22)" }}>
            <Bot size={16} style={{ color: "#39ff8e" }} strokeWidth={1.7} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold" style={{ fontFamily: "'Syne',sans-serif", color: "rgba(255,255,255,0.85)" }}>
              Coalitus
            </h2>
            <p className="text-[9px] tracking-widest" style={{ color: "rgba(57,255,142,0.5)" }}>
              MENTAL HEALTH AI
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#39ff8e", boxShadow: "0 0 6px #39ff8e" }} />
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>online</span>
          </div>
        </div>

        {/* ── messages ── */}
        <div className="flex-1 overflow-y-auto py-4 space-y-1">
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* ── crisis banner ── */}
        {showCrisis && <CrisisBanner />}

        {/* ── error ── */}
        {error && (
          <div className="mx-4 mb-3 flex items-start gap-2 px-4 py-3 rounded-xl text-xs"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
            <AlertTriangle size={13} strokeWidth={1.8} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* ── input ── */}
        <div className="px-4 pb-4">
          <div className="flex items-end gap-3 px-4 py-3 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(57,255,142,0.15)" }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKey}
              rows={1}
              placeholder="Share what's on your mind…"
              className="flex-1 resize-none outline-none text-sm leading-relaxed bg-transparent"
              style={{
                color:      "rgba(255,255,255,0.78)",
                caretColor: "#39ff8e",
                fontFamily: "'Space Mono', monospace",
                fontSize:   13,
                maxHeight:  140,
                overflowY:  "auto",
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150"
              style={{
                background: !input.trim() || loading ? "rgba(255,255,255,0.04)" : "rgba(57,255,142,0.14)",
                border:     `1px solid ${!input.trim() || loading ? "rgba(255,255,255,0.07)" : "rgba(57,255,142,0.35)"}`,
                cursor:     !input.trim() || loading ? "not-allowed" : "pointer",
              }}
            >
              {loading
                ? <Loader2 size={13} className="animate-spin" style={{ color: "#39ff8e" }} />
                : <Send    size={13} style={{ color: !input.trim() ? "rgba(255,255,255,0.15)" : "#39ff8e" }} strokeWidth={1.8} />
              }
            </button>
          </div>
          <p className="text-center text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.1)" }}>
            Not a substitute for professional mental health care · Press Enter to send
          </p>
        </div>
      </div>
    </>
  );
}