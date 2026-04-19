"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/* ── Emotion Models ─────────────────────────────────────────────────────── */
const MODELS = [
  {
    id: "hartmann",
    name: "DistilRoBERTa",
    hfId: "j-hartmann/emotion-english-distilroberta-base",
    color: "#00ff41",
    dim: "#00cc33",
    badge: "7-class",
    desc: "anger · disgust · fear · joy · neutral · sadness · surprise",
  },
  {
    id: "samlowe",
    name: "GoEmotions",
    hfId: "SamLowe/roberta-base-go_emotions",
    color: "#00d4ff",
    dim: "#009ec0",
    badge: "28-class",
    desc: "fine-grained emotion taxonomy from Google research",
  },
  {
    id: "bhadresh",
    name: "DistilBERT",
    hfId: "bhadresh-savani/distilbert-base-uncased-emotion",
    color: "#ff00aa",
    dim: "#cc0088",
    badge: "6-class",
    desc: "sadness · joy · love · anger · fear · surprise",
  },
  {
    id: "michelle",
    name: "EmoClassify",
    hfId: "michellejieli/emotion_text_classifier",
    color: "#ffaa00",
    dim: "#cc8800",
    badge: "6-class",
    desc: "sentiment-aware 6-label emotion classifier",
  },
];

const TABS = [
  {
    id: "chat",
    label: "Chat",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "analysis",
    label: "Analysis",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "history",
    label: "History",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

/* ── Helpers ────────────────────────────────────────────────────────────── */
function mockAnalyze(text) {
  const lower = text.toLowerCase();
  const base = { anger: 0.04, disgust: 0.03, fear: 0.04, joy: 0.06, neutral: 0.75, sadness: 0.05, surprise: 0.03 };
  if (/happy|great|awesome|love|wonderful|amazing|excited|glad/.test(lower))
    return { ...base, joy: 0.82, neutral: 0.1 };
  if (/sad|sorry|miss|lonely|cry|depressed|hurt/.test(lower))
    return { ...base, sadness: 0.76, neutral: 0.12 };
  if (/angry|hate|furious|annoyed|rage|mad/.test(lower))
    return { ...base, anger: 0.79, neutral: 0.1 };
  if (/scared|afraid|worried|anxious|nervous|terrified/.test(lower))
    return { ...base, fear: 0.73, neutral: 0.14 };
  if (/wow|really|surprising|unexpected|shocked/.test(lower))
    return { ...base, surprise: 0.68, neutral: 0.2 };
  return base;
}

async function callHuggingFace(text, hfId) {
  try {
    const res = await fetch(`https://api-inference.huggingface.co/models/${hfId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: text }),
    });
    if (!res.ok) throw new Error("hf error");
    const data = await res.json();
    const raw = Array.isArray(data[0]) ? data[0] : data;
    if (!Array.isArray(raw) || !raw[0]?.label) throw new Error("bad shape");
    const sorted = [...raw].sort((a, b) => b.score - a.score).slice(0, 7);
    return Object.fromEntries(sorted.map((x) => [x.label.toLowerCase(), x.score]));
  } catch {
    return mockAnalyze(text);
  }
}

function fmt(n) { return (n * 100).toFixed(1) + "%"; }
function topEmotion(scores) {
  if (!scores) return null;
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function EmotionBar({ label, score, color }) {
  return (
    <div className="mb-1.5">
      <div className="flex justify-between mb-0.5">
        <span style={{ fontSize: 10, color: "#6a9a6a", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
        <span style={{ fontSize: 10, color: color || "#00ff41" }}>{fmt(score)}</span>
      </div>
      <div style={{ height: 4, background: "#0f1a0f", borderRadius: 2, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${(score * 100).toFixed(1)}%`,
            background: color || "#00ff41",
            borderRadius: 2,
            transition: "width 0.6s ease",
            boxShadow: `0 0 6px ${color || "#00ff41"}88`,
          }}
        />
      </div>
    </div>
  );
}

function ModelCard({ model, enabled, onToggle, results, dragging, dragOver, onDragStart, onDragOver, onDrop, onDragEnd }) {
  const scores = results?.[model.id];
  const top = topEmotion(scores);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, model.id)}
      onDragOver={(e) => onDragOver(e, model.id)}
      onDrop={(e) => onDrop(e, model.id)}
      onDragEnd={onDragEnd}
      style={{
        background: dragOver === model.id ? "#0f200f" : "#0b140b",
        border: `1px solid ${dragging === model.id ? model.color + "88" : dragOver === model.id ? model.color + "44" : "#1a2e1a"}`,
        borderRadius: 8,
        padding: "10px 12px",
        marginBottom: 8,
        cursor: "grab",
        opacity: dragging === model.id ? 0.5 : 1,
        transition: "all 0.15s ease",
        boxShadow: dragOver === model.id ? `0 0 12px ${model.color}22` : "none",
      }}
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Drag handle */}
          <div style={{ color: "#2a4a2a", cursor: "grab", fontSize: 12, lineHeight: 1 }}>⠿</div>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: enabled ? model.color : "#1a2e1a", boxShadow: enabled ? `0 0 6px ${model.color}` : "none", transition: "all 0.3s" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: enabled ? model.color : "#4a6a4a", fontFamily: "monospace" }}>
            {model.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 9, color: model.color + "88", border: `1px solid ${model.color}33`, borderRadius: 3, padding: "1px 5px", letterSpacing: "0.05em" }}>
            {model.badge}
          </span>
          {/* Toggle */}
          <button
            onClick={() => onToggle(model.id)}
            style={{
              width: 28,
              height: 16,
              borderRadius: 8,
              background: enabled ? model.color + "33" : "#0f1a0f",
              border: `1px solid ${enabled ? model.color : "#1a2e1a"}`,
              padding: "2px",
              cursor: "pointer",
              position: "relative",
              transition: "all 0.2s",
            }}
          >
            <div style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: enabled ? model.color : "#2a4a2a",
              position: "absolute",
              top: 2,
              left: enabled ? 14 : 2,
              transition: "all 0.2s",
              boxShadow: enabled ? `0 0 4px ${model.color}` : "none",
            }} />
          </button>
        </div>
      </div>

      {/* Results */}
      {enabled && scores ? (
        <div>
          {Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([label, score]) => (
              <EmotionBar key={label} label={label} score={score} color={model.color} />
            ))}
          {top && (
            <div style={{ marginTop: 6, padding: "4px 8px", background: model.color + "11", borderRadius: 4, border: `1px solid ${model.color}22` }}>
              <span style={{ fontSize: 9, color: model.color + "aa", letterSpacing: "0.08em" }}>DOMINANT</span>
              <span style={{ fontSize: 11, color: model.color, marginLeft: 6, fontWeight: 600 }}>{top[0]}</span>
              <span style={{ fontSize: 10, color: model.dim, marginLeft: 4 }}>{fmt(top[1])}</span>
            </div>
          )}
        </div>
      ) : enabled ? (
        <div style={{ fontSize: 10, color: "#2a4a2a", textAlign: "center", padding: "6px 0", letterSpacing: "0.08em" }}>
          AWAITING INPUT...
        </div>
      ) : (
        <div style={{ fontSize: 10, color: "#1a2e1a", textAlign: "center", padding: "6px 0", letterSpacing: "0.08em" }}>
          MODEL DISABLED
        </div>
      )}
    </div>
  );
}

function ChatMessage({ msg, modelResults, enabledModels, orderedModels }) {
  const ts = msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp);
  const isUser = msg.role === "user";

  return (
    <div style={{ marginBottom: 20 }}>
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-3`}>
        {!isUser && (
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "#0f1a0f", border: "1px solid #00ff4144",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, color: "#00ff41", flexShrink: 0, marginTop: 2,
          }}>AI</div>
        )}
        <div style={{ maxWidth: "72%" }}>
          <div style={{
            background: isUser ? "#0d1f0d" : "#0b140b",
            border: `1px solid ${isUser ? "#00ff4133" : "#1a2e1a"}`,
            borderRadius: isUser ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
            padding: "10px 14px",
            fontSize: 13,
            color: isUser ? "#b0e8b0" : "#88c888",
            lineHeight: 1.6,
          }}>
            {msg.content}
          </div>
          <div style={{ fontSize: 9, color: "#2a4a2a", marginTop: 3, textAlign: isUser ? "right" : "left", letterSpacing: "0.05em" }}>
            {ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
        {isUser && (
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "#0d1f0d", border: "1px solid #00ff4144",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, color: "#00ff41", flexShrink: 0, marginTop: 2,
          }}>YOU</div>
        )}
      </div>
    </div>
  );
}

/* ── Analysis Tab ────────────────────────────────────────────────────────── */
function AnalysisView({ modelResults, orderedModels, enabledModels }) {
  const enabled = orderedModels.filter((m) => enabledModels.has(m.id));
  return (
    <div style={{ padding: "24px 32px", overflowY: "auto", height: "100%" }}>
      <div style={{ fontSize: 11, color: "#00ff41", letterSpacing: "0.15em", marginBottom: 16 }}>EMOTION ANALYSIS DASHBOARD</div>
      {enabled.length === 0 ? (
        <div style={{ color: "#2a4a2a", fontSize: 13, textAlign: "center", paddingTop: 80 }}>Enable models in the right panel to see analysis</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {enabled.map((model) => {
            const scores = modelResults[model.id];
            return (
              <div key={model.id} style={{ background: "#0b140b", border: `1px solid ${model.color}33`, borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 11, color: model.color, letterSpacing: "0.1em", marginBottom: 12 }}>{model.name.toUpperCase()}</div>
                {scores ? (
                  Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([label, score]) => (
                    <EmotionBar key={label} label={label} score={score} color={model.color} />
                  ))
                ) : (
                  <div style={{ fontSize: 11, color: "#2a4a2a" }}>No data yet — start chatting</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── History Tab ─────────────────────────────────────────────────────────── */
function HistoryView({ messages }) {
  return (
    <div style={{ padding: "24px 32px", overflowY: "auto", height: "100%" }}>
      <div style={{ fontSize: 11, color: "#00ff41", letterSpacing: "0.15em", marginBottom: 16 }}>CONVERSATION HISTORY</div>
      {messages.length === 0 ? (
        <div style={{ color: "#2a4a2a", fontSize: 13 }}>No messages yet.</div>
      ) : (
        messages.map((m) => (
          <div key={m.id} style={{ borderBottom: "1px solid #0f1a0f", padding: "10px 0", fontSize: 12 }}>
            <span style={{ color: m.role === "user" ? "#00ff41" : "#6a9a6a", marginRight: 10, letterSpacing: "0.08em" }}>
              {m.role === "user" ? "YOU" : " AI"}
            </span>
            <span style={{ color: "#88a888" }}>{m.content.slice(0, 120)}{m.content.length > 120 ? "…" : ""}</span>
          </div>
        ))
      )}
    </div>
  );
}

/* ── Settings Tab ────────────────────────────────────────────────────────── */
function SettingsView() {
  return (
    <div style={{ padding: "24px 32px" }}>
      <div style={{ fontSize: 11, color: "#00ff41", letterSpacing: "0.15em", marginBottom: 20 }}>SYSTEM CONFIGURATION</div>
      {[
        { label: "HuggingFace API Token", placeholder: "hf_xxxxxxxxxxxxxxxxxxxx", hint: "Optional – increases rate limits" },
        { label: "Groq API Key", placeholder: "gsk_xxxxxxxxxxxxxxxxxxxx", hint: "Required for AI responses — set GROQ_API_KEY in .env.local" },
        { label: "Analysis Debounce (ms)", placeholder: "500", hint: "Delay before running emotion analysis" },
      ].map((field) => (
        <div key={field.label} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#6a9a6a", letterSpacing: "0.08em", marginBottom: 6 }}>{field.label.toUpperCase()}</div>
          <input
            placeholder={field.placeholder}
            style={{
              width: "100%", background: "#0b140b", border: "1px solid #1a2e1a",
              borderRadius: 6, padding: "8px 12px", fontSize: 12,
              color: "#88c888", fontFamily: "monospace", outline: "none",
              boxSizing: "border-box",
            }}
          />
          <div style={{ fontSize: 10, color: "#2a4a2a", marginTop: 4 }}>{field.hint}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function EmotionChatPage() {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Neural link established. I'm your emotion-aware AI. The models on the right will analyze our conversation in real-time — drag to reorder, toggle to enable/disable.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modelOrder, setModelOrder] = useState(MODELS.map((m) => m.id));
  const [enabledModels, setEnabledModels] = useState(new Set(MODELS.map((m) => m.id)));
  const [modelResults, setModelResults] = useState({});
  const [draggedModel, setDraggedModel] = useState(null);
  const [dragOverModel, setDragOverModel] = useState(null);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const orderedModels = modelOrder.map((id) => MODELS.find((m) => m.id === id)).filter(Boolean);

  const toggleModel = useCallback((id) => {
    setEnabledModels((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const runAnalysis = useCallback(
    async (text) => {
      const active = MODELS.filter((m) => enabledModels.has(m.id));
      const entries = await Promise.all(
        active.map(async (m) => [m.id, await callHuggingFace(text, m.hfId)])
      );
      setModelResults((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
    },
    [enabledModels]
  );

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = { id: Date.now(), role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    runAnalysis(text);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...history, { role: "user", content: text }],
        }),
      });
      const data = await res.json();
      const reply = data.content ?? "Signal lost. Reconnecting…";
      const assistantMsg = { id: Date.now() + 1, role: "assistant", content: reply, timestamp: new Date() };
      setMessages((prev) => [...prev, assistantMsg]);
      runAnalysis(reply);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: "⚠ Connection error. Check your API key in Settings.", timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, runAnalysis]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  /* Drag handlers */
  const handleDragStart = (e, id) => { setDraggedModel(id); e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver = (e, id) => { e.preventDefault(); setDragOverModel(id); };
  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (!draggedModel || draggedModel === targetId) return;
    setModelOrder((prev) => {
      const arr = [...prev];
      const from = arr.indexOf(draggedModel);
      const to = arr.indexOf(targetId);
      arr.splice(from, 1);
      arr.splice(to, 0, draggedModel);
      return arr;
    });
    setDraggedModel(null);
    setDragOverModel(null);
  };
  const handleDragEnd = () => { setDraggedModel(null); setDragOverModel(null); };

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#060a06",
        color: "#00ff41",
        fontFamily: "'Courier New', 'Courier', monospace",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* CRT Scanline overlay */}
      <div
        style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9998,
          background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px)",
        }}
      />

      {/* ── LEFT SIDEBAR ─────────────────────────────────────────────── */}
      <nav
        style={{
          width: 64,
          background: "#050805",
          borderRight: "1px solid #0f1a0f",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px 0",
          gap: 0,
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 24, color: "#00ff41" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <polygon points="12,2 22,20 2,20" stroke="#00ff41" strokeWidth="1.5" fill="none" />
            <circle cx="12" cy="14" r="2" fill="#00ff41" />
            <line x1="12" y1="8" x2="12" y2="12" stroke="#00ff41" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Tab buttons */}
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
              style={{
                width: "100%",
                padding: "12px 0",
                background: active ? "#0d1f0d" : "transparent",
                border: "none",
                borderLeft: `2px solid ${active ? "#00ff41" : "transparent"}`,
                color: active ? "#00ff41" : "#2a4a2a",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                transition: "all 0.15s",
              }}
            >
              <span style={{ color: "inherit" }}>{tab.icon}</span>
              <span style={{ fontSize: 8, letterSpacing: "0.08em", color: active ? "#00ff41" : "#1a3a1a" }}>
                {tab.label.toUpperCase()}
              </span>
            </button>
          );
        })}

        {/* Spacer + bottom decoration */}
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 8, color: "#0f1f0f", letterSpacing: "0.1em", textAlign: "center", padding: "8px 4px", lineHeight: 1.8 }}>
          EMO<br />SYS<br />v2.1
        </div>
      </nav>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Top bar */}
        <div
          style={{
            height: 44,
            background: "#050805",
            borderBottom: "1px solid #0f1a0f",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff41", boxShadow: "0 0 6px #00ff41", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, letterSpacing: "0.15em", color: "#6a9a6a" }}>
            EMOTION NEURAL NETWORK — {activeTab.toUpperCase()} MODULE
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: "#2a4a2a", letterSpacing: "0.05em" }}>
            {enabledModels.size}/{MODELS.length} MODELS ACTIVE
          </span>
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {/* ── CHAT VIEW ── */}
          {activeTab === "chat" && (
            <>
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    msg={msg}
                    modelResults={modelResults}
                    enabledModels={enabledModels}
                    orderedModels={orderedModels}
                  />
                ))}
                {isLoading && (
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#0f1a0f", border: "1px solid #00ff4144", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#00ff41" }}>AI</div>
                    <div style={{ display: "flex", gap: 4, padding: "8px 14px", background: "#0b140b", border: "1px solid #1a2e1a", borderRadius: "12px 12px 12px 2px" }}>
                      {[0, 1, 2].map((i) => (
                        <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff41", animation: `blink 1.2s ${i * 0.2}s infinite` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input area */}
              <div style={{ borderTop: "1px solid #0f1a0f", padding: "14px 20px", background: "#050805", flexShrink: 0 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="TYPE MESSAGE — ENTER TO SEND"
                    rows={1}
                    style={{
                      flex: 1, background: "#0b140b",
                      border: "1px solid #1a2e1a",
                      borderRadius: 8, padding: "10px 14px",
                      fontSize: 12, color: "#88c888",
                      fontFamily: "monospace", resize: "none",
                      outline: "none", lineHeight: 1.5,
                      maxHeight: 120, overflowY: "auto",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#00ff4144")}
                    onBlur={(e) => (e.target.style.borderColor = "#1a2e1a")}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    style={{
                      padding: "10px 20px", background: isLoading || !input.trim() ? "#0b140b" : "#00ff1122",
                      border: `1px solid ${isLoading || !input.trim() ? "#1a2e1a" : "#00ff41"}`,
                      borderRadius: 8, color: isLoading || !input.trim() ? "#2a4a2a" : "#00ff41",
                      fontSize: 11, cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                      letterSpacing: "0.1em", transition: "all 0.15s",
                      boxShadow: !isLoading && input.trim() ? "0 0 10px #00ff4122" : "none",
                    }}
                  >
                    SEND →
                  </button>
                </div>
                <div style={{ fontSize: 9, color: "#1a3a1a", marginTop: 6, letterSpacing: "0.06em" }}>
                  SHIFT+ENTER for newline · {enabledModels.size} model{enabledModels.size !== 1 ? "s" : ""} analyzing
                </div>
              </div>
            </>
          )}

          {activeTab === "analysis" && (
            <AnalysisView modelResults={modelResults} orderedModels={orderedModels} enabledModels={enabledModels} />
          )}
          {activeTab === "history" && <HistoryView messages={messages} />}
          {activeTab === "settings" && <SettingsView />}
        </div>
      </main>

      {/* ── RIGHT SIDEBAR ─────────────────────────────────────────────── */}
      <aside
        style={{
          width: 280,
          background: "#050805",
          borderLeft: "1px solid #0f1a0f",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Header */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #0f1a0f", flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: "#00ff41", letterSpacing: "0.15em" }}>NEURAL MODELS</div>
          <div style={{ fontSize: 9, color: "#2a4a2a", marginTop: 2, letterSpacing: "0.06em" }}>DRAG TO REORDER · TOGGLE TO ENABLE</div>
        </div>

        {/* Model cards */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
          {orderedModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              enabled={enabledModels.has(model.id)}
              onToggle={toggleModel}
              results={modelResults}
              dragging={draggedModel}
              dragOver={dragOverModel}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            />
          ))}

          {/* Consensus section */}
          {Object.keys(modelResults).length > 0 && (
            <div style={{ marginTop: 12, padding: "10px 12px", background: "#0b140b", border: "1px solid #1a2e1a", borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: "#6a9a6a", letterSpacing: "0.12em", marginBottom: 8 }}>ENSEMBLE CONSENSUS</div>
              {(() => {
                const all = {};
                Object.entries(modelResults).forEach(([mid, scores]) => {
                  if (!enabledModels.has(mid) || !scores) return;
                  Object.entries(scores).forEach(([label, score]) => {
                    all[label] = (all[label] || 0) + score;
                  });
                });
                const count = Object.keys(modelResults).filter((id) => enabledModels.has(id)).length;
                if (count === 0) return null;
                const avg = Object.fromEntries(Object.entries(all).map(([k, v]) => [k, v / count]));
                const top = Object.entries(avg).sort((a, b) => b[1] - a[1]).slice(0, 3);
                return top.map(([label, score]) => (
                  <EmotionBar key={label} label={label} score={score} color="#00ff41" />
                ));
              })()}
            </div>
          )}
        </div>
      </aside>

      {/* CSS animations */}
      <style>{`
        @keyframes blink { 0%,80%,100%{opacity:0.2} 40%{opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #060a06; }
        ::-webkit-scrollbar-thumb { background: #1a2e1a; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #2a4a2a; }
      `}</style>
    </div>
  );
}