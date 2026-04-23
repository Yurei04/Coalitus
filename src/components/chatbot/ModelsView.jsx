"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink, Brain, HeartPulse, BookOpen, GraduationCap, Copy, Check } from "lucide-react";
import { MY_MODELS, API_SPACE_URL } from "@/lib/constants";

const MODEL_ICONS = [Brain, HeartPulse, BookOpen, GraduationCap];

/* ─── code snippets ─────────────────────────────────────── */
const JS_SNIPPETS = {
  emotion: `const res = await fetch(\`\${API_SPACE_URL}/analyze\`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "I feel so hopeless today." }),
});
const { emotion } = await res.json();
// { label: "sadness", confidence: 0.97 }`,

  topic: `const res = await fetch(\`\${API_SPACE_URL}/analyze\`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "I can't sleep, I keep overthinking." }),
});
const { topic } = await res.json();
// { label: "sleep_issues", confidence: 0.89 }`,

  distortion: `const res = await fetch(\`\${API_SPACE_URL}/analyze\`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "I always mess everything up.", distortion_threshold: 0.5 }),
});
const { distortion } = await res.json();
// { has_distortions: true, detected: [...] }`,

  stress: `const res = await fetch(\`\${API_SPACE_URL}/stress\`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ anxiety_level: 15, depression: 18, sleep_quality: 1, ... }),
});
const { label, confidence } = await res.json();
// { label: "high", confidence: 0.86 }`,
};

const PY_SNIPPETS = {
  emotion: `import requests
r = requests.post(f"{API_SPACE_URL}/analyze", json={
    "text": "I feel so hopeless today."
})
print(r.json()["emotion"])
# {"label": "sadness", "confidence": 0.97}`,

  topic: `import requests
r = requests.post(f"{API_SPACE_URL}/analyze", json={
    "text": "I can't sleep, I keep overthinking."
})
print(r.json()["topic"])
# {"label": "sleep_issues", "confidence": 0.89}`,

  distortion: `import requests
r = requests.post(f"{API_SPACE_URL}/analyze", json={
    "text": "I always mess everything up.",
    "distortion_threshold": 0.5,
})
print(r.json()["distortion"])
# {"has_distortions": True, "detected": [...]}`,

  stress: `import requests
r = requests.post(f"{API_SPACE_URL}/stress", json={
    "anxiety_level": 15, "depression": 18, "sleep_quality": 1,
    # ... other fields
})
print(r.json())
# {"label": "high", "confidence": 0.86}`,
};

/* ─── CodeBlock ─────────────────────────────────────────── */
function CodeBlock({ code, color }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative mt-3">
      <pre
        className="rounded-xl px-4 py-3.5 text-[11.5px] leading-[1.8] overflow-x-auto"
        style={{
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.4)",
          fontFamily: "'Space Mono', monospace",
          margin: 0,
          whiteSpace: "pre",
        }}
      >
        {code.split("\n").map((line, i) => {
          const isComment = line.trim().startsWith("//") || line.trim().startsWith("#");
          if (isComment) {
            return (
              <span key={i} style={{ display: "block", color: "rgba(57,255,142,0.38)" }}>
                {line}
              </span>
            );
          }
          const parts = line.split(/("[^"]*"|'[^']*')/g);
          return (
            <span key={i} style={{ display: "block" }}>
              {parts.map((p, j) =>
                p.startsWith('"') || p.startsWith("'")
                  ? <span key={j} style={{ color: "#fbbf24" }}>{p}</span>
                  : <span key={j}>{p}</span>
              )}
            </span>
          );
        })}
      </pre>

      <button
        onClick={(e) => { e.stopPropagation(); copy(); }}
        className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-150"
        style={{
          background: copied ? `${color}18` : "rgba(255,255,255,0.04)",
          border: `1px solid ${copied ? color + "35" : "rgba(255,255,255,0.07)"}`,
          color: copied ? color : "rgba(255,255,255,0.25)",
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          cursor: "pointer",
        }}
      >
        {copied ? <Check size={10} /> : <Copy size={10} />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

/* ─── ModelsView ─────────────────────────────────────────── */
export function ModelsView() {
  const [expanded, setExpanded] = useState(null);
  const [tabs, setTabs]         = useState({});

  const getTab = (id) => tabs[id] ?? "js";
  const setTab = (id, t) => setTabs((p) => ({ ...p, [id]: t }));

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');`}</style>

      <div
        className="flex-1 overflow-y-auto p-6"
        style={{ background: "rgba(0,9,29,0.98)" }}
      >
        <div className="max-w-2xl mx-auto space-y-4">

          {/* heading */}
          <div className="mb-6">
            <h2
              className="text-xl font-extrabold mb-1"
              style={{
                fontFamily: "'Syne', sans-serif",
                background: "linear-gradient(135deg,#d1fae5,#86efac)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Our Models
            </h2>
            <p
              className="text-sm"
              style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.25)" }}
            >
              4 custom NLP models — click any card to see details & code snippets.
            </p>
          </div>

          {/* cards */}
          {MY_MODELS.map((m, index) => {
            const isOpen = expanded === m.id;
            const tab    = getTab(m.id);
            const Icon   = MODEL_ICONS[index % MODEL_ICONS.length];

            return (
              <div
                key={m.id}
                className="rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  background: isOpen ? `${m.color}06` : "rgba(255,255,255,0.025)",
                  border: `1px solid ${isOpen ? m.color + "35" : "rgba(255,255,255,0.07)"}`,
                  boxShadow: isOpen ? `0 0 24px ${m.color}10` : "none",
                }}
              >
                {/* header — always visible */}
                <button
                  className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors duration-150"
                  style={{ cursor: "pointer", background: "transparent", border: "none" }}
                  onClick={() => setExpanded(isOpen ? null : m.id)}
                >
                  {/* icon */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `${m.color}12`,
                      border: `1px solid ${m.color}28`,
                    }}
                  >
                    <Icon size={17} style={{ color: m.color }} strokeWidth={1.7} />
                  </div>

                  {/* name + arch */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-sm font-bold"
                        style={{ fontFamily: "'Syne', sans-serif", color: "rgba(255,255,255,0.82)" }}
                      >
                        {m.name}
                      </span>
                      <span
                        className="text-[9px] px-2 py-0.5 rounded-full tracking-widest"
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          background: `${m.color}12`,
                          border: `1px solid ${m.color}25`,
                          color: m.color,
                        }}
                      >
                        {m.badge}
                      </span>
                    </div>
                    <p
                      className="text-[11px] mt-0.5 truncate"
                      style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.22)" }}
                    >
                      {m.architecture}
                    </p>
                  </div>

                  <ChevronDown
                    size={15}
                    strokeWidth={2}
                    style={{
                      color: isOpen ? m.color : "rgba(255,255,255,0.2)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s, color 0.2s",
                      flexShrink: 0,
                    }}
                  />
                </button>

                {/* expanded body */}
                {isOpen && (
                  <div
                    className="px-5 pb-5 space-y-4"
                    style={{ borderTop: `1px solid ${m.color}15` }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* description */}
                    <p
                      className="text-sm leading-relaxed pt-4"
                      style={{ color: "rgba(255,255,255,0.42)" }}
                    >
                      {m.description}
                    </p>

                    {/* labels */}
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-[0.18em] mb-2"
                        style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.22)" }}
                      >
                        Output Labels
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.labels.map((label) => (
                          <span
                            key={label}
                            className="text-[11px] px-2.5 py-0.5 rounded-lg"
                            style={{
                              fontFamily: "'Space Mono', monospace",
                              background: `${m.color}0a`,
                              border: `1px solid ${m.color}20`,
                              color: m.color,
                            }}
                          >
                            {label.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* use case */}
                    {m.useCase && (
                      <div>
                        <p
                          className="text-[10px] uppercase tracking-[0.18em] mb-1"
                          style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.22)" }}
                        >
                          Use Cases
                        </p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.32)" }}>
                          {m.useCase}
                        </p>
                      </div>
                    )}

                    {/* code */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p
                          className="text-[10px] uppercase tracking-[0.18em]"
                          style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.22)" }}
                        >
                          How to Use
                        </p>
                        {/* lang tabs */}
                        <div
                          className="flex rounded-lg overflow-hidden"
                          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          {["js", "python"].map((lang) => (
                            <button
                              key={lang}
                              onClick={() => setTab(m.id, lang)}
                              className="text-[10px] px-3 py-1 transition-colors duration-150"
                              style={{
                                fontFamily: "'Space Mono', monospace",
                                background: tab === lang ? `${m.color}18` : "transparent",
                                color: tab === lang ? m.color : "rgba(255,255,255,0.22)",
                                borderRight: lang === "js" ? "1px solid rgba(255,255,255,0.08)" : "none",
                                cursor: "pointer",
                              }}
                            >
                              {lang === "js" ? "JS" : "Python"}
                            </button>
                          ))}
                        </div>
                      </div>
                      <CodeBlock
                        code={tab === "js" ? JS_SNIPPETS[m.id] : PY_SNIPPETS[m.id]}
                        color={m.color}
                      />
                    </div>

                    {/* HF link */}
                    <a
                      href={m.hfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-xl transition-all duration-150"
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        background: `${m.color}0f`,
                        color: m.color,
                        border: `1px solid ${m.color}30`,
                        textDecoration: "none",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = `${m.color}1e`;
                        e.currentTarget.style.boxShadow  = `0 0 14px ${m.color}20`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = `${m.color}0f`;
                        e.currentTarget.style.boxShadow  = "none";
                      }}
                    >
                      <ExternalLink size={12} strokeWidth={1.8} />
                      View on Hugging Face
                    </a>
                  </div>
                )}
              </div>
            );
          })}

          {/* footer note */}
          <p
            className="text-center text-[10px] pt-2"
            style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.12)" }}
          >
            All models are free and open · Hosted on Hugging Face Spaces · No API key needed
          </p>
        </div>
      </div>
    </>
  );
}