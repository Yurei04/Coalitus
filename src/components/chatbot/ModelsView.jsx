"use client";

import { useState } from "react";
import { MY_MODELS, API_SPACE_URL } from "@/lib/constants";

const JS_SNIPPETS = {
  emotion: `// Via the unified API (recommended)
const res = await fetch(\`\${API_SPACE_URL}/analyze\`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "I feel so hopeless today." }),
});
const { emotion } = await res.json();
// { label: "sadness", confidence: 0.97, scores: { ... } }`,

  topic: `// Via the unified API (recommended)
const res = await fetch(\`\${API_SPACE_URL}/analyze\`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "I can't sleep, I keep overthinking." }),
});
const { topic } = await res.json();
// { label: "sleep_issues", confidence: 0.89, scores: { ... } }`,

  distortion: `// Via the unified API (recommended)
const res = await fetch(\`\${API_SPACE_URL}/analyze\`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "I always mess everything up.",
    distortion_threshold: 0.5,
  }),
});
const { distortion } = await res.json();
// { has_distortions: true,
//   detected: [{ label: "overgeneralization", confidence: 0.82 }] }`,

  stress: `// Stress model uses its own endpoint
const res = await fetch(\`\${API_SPACE_URL}/stress\`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    anxiety_level: 15,       self_esteem: 10,
    mental_health_history: 1, depression: 18,
    headache: 4,             blood_pressure: 2,
    sleep_quality: 1,        breathing_problem: 3,
    noise_level: 3,          living_conditions: 2,
    safety: 2,               basic_needs: 2,
    academic_performance: 2, study_load: 4,
    teacher_student_relationship: 2,
    future_career_concerns: 4,
    social_support: 1,       peer_pressure: 4,
    extracurricular_activities: 2, bullying: 3,
  }),
});
const { label, confidence } = await res.json();
// { label: "high", confidence: 0.86, scores: { ... } }`,
};

const PY_SNIPPETS = {
  emotion: `import requests

r = requests.post(f"{API_SPACE_URL}/analyze", json={
    "text": "I feel so hopeless today."
})
data = r.json()
print(data["emotion"])
# {"label": "sadness", "confidence": 0.97, "scores": {...}}`,

  topic: `import requests

r = requests.post(f"{API_SPACE_URL}/analyze", json={
    "text": "I can't sleep, I keep overthinking."
})
data = r.json()
print(data["topic"])
# {"label": "sleep_issues", "confidence": 0.89, "scores": {...}}`,

  distortion: `import requests

r = requests.post(f"{API_SPACE_URL}/analyze", json={
    "text": "I always mess everything up.",
    "distortion_threshold": 0.5,
})
data = r.json()
print(data["distortion"])
# {"has_distortions": True,
#  "detected": [{"label": "overgeneralization", "confidence": 0.82}]}`,

  stress: `import requests

r = requests.post(f"{API_SPACE_URL}/stress", json={
    "anxiety_level": 15,       "self_esteem": 10,
    "mental_health_history": 1, "depression": 18,
    "headache": 4,             "blood_pressure": 2,
    "sleep_quality": 1,        "breathing_problem": 3,
    "noise_level": 3,          "living_conditions": 2,
    "safety": 2,               "basic_needs": 2,
    "academic_performance": 2, "study_load": 4,
    "teacher_student_relationship": 2,
    "future_career_concerns": 4,
    "social_support": 1,       "peer_pressure": 4,
    "extracurricular_activities": 2, "bullying": 3,
})
print(r.json())
# {"label": "high", "confidence": 0.86, "scores": {...}}`,
};

const card = {
  background: "rgba(22,24,28,0.98)",
  border: "1px solid rgba(74,222,128,0.12)",
  borderRadius: 14,
  padding: "20px",
  cursor: "pointer",
  transition: "all 0.2s",
};

function CodeBlock({ code, color }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ position: "relative", marginTop: 10 }}>
      <pre style={{
        background: "rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10,
        padding: "14px 16px",
        fontSize: 11.5,
        lineHeight: 1.75,
        color: "#a1a1aa",
        overflowX: "auto",
        margin: 0,
        whiteSpace: "pre",
      }}>
        {code.split("\n").map((line, i) => {
          if (line.trim().startsWith("//") || line.trim().startsWith("#")) {
            return <span key={i} style={{ color: "rgba(74,222,128,0.45)", display: "block" }}>{line}</span>;
          }
          const parts = line.split(/("[^"]*"|'[^']*')/g);
          return (
            <span key={i} style={{ display: "block" }}>
              {parts.map((p, j) =>
                (p.startsWith('"') || p.startsWith("'"))
                  ? <span key={j} style={{ color: "#fbbf24" }}>{p}</span>
                  : <span key={j}>{p}</span>
              )}
            </span>
          );
        })}
      </pre>
      <button
        onClick={(e) => { e.stopPropagation(); copy(); }}
        className="absolute top-2.5 right-2.5 text-[10px] px-2.5 py-1 rounded-lg transition-all"
        style={{
          background: copied ? `${color}25` : "rgba(255,255,255,0.05)",
          color:      copied ? color        : "#52525b",
          border:     `1px solid ${copied ? color + "40" : "rgba(255,255,255,0.08)"}`,
        }}
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );
}

export function ModelsView() {
  const [expanded, setExpanded] = useState(null);
  const [tabs, setTabs]         = useState({});

  const getTab = (id) => tabs[id] ?? "js";
  const setTab = (id, t) => setTabs((p) => ({ ...p, [id]: t }));

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ background: "#0a0a0b" }}>
      <div className="max-w-3xl mx-auto space-y-5">

        <div>
          <h2 className="text-lg font-semibold" style={{ color: "#d1fae5" }}>🤖 Our Models</h2>
          <p className="text-sm mt-1" style={{ color: "#52525b" }}>
            4 custom-trained NLP models powering this app. Click any card to see details and code.
          </p>
        </div>

        <div className="space-y-3">
          {MY_MODELS.map((m) => {
            const isOpen = expanded === m.id;
            const tab    = getTab(m.id);

            return (
              <div
                key={m.id}
                onClick={() => setExpanded(isOpen ? null : m.id)}
                style={{
                  ...card,
                  border:    isOpen ? `1px solid ${m.color}50` : "1px solid rgba(74,222,128,0.12)",
                  boxShadow: isOpen ? `0 0 20px ${m.glow}`     : "none",
                }}
                onMouseEnter={e => { if (!isOpen) e.currentTarget.style.borderColor = "rgba(74,222,128,0.3)"; }}
                onMouseLeave={e => { if (!isOpen) e.currentTarget.style.borderColor = "rgba(74,222,128,0.12)"; }}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                      style={{ background: `${m.color}18`, border: `1px solid ${m.color}40`, boxShadow: `0 0 10px ${m.glow}` }}>
                      {m.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: "#d1fae5" }}>{m.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ background: `${m.color}18`, color: m.color, border: `1px solid ${m.color}30` }}>
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: "#52525b" }}>{m.architecture}</p>
                    </div>
                  </div>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    style={{ color: "rgba(74,222,128,0.4)", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div className="mt-4 space-y-4" onClick={(e) => e.stopPropagation()}
                    style={{ borderTop: `1px solid ${m.color}20`, paddingTop: 16 }}>

                    <p className="text-sm leading-relaxed" style={{ color: "#a1a1aa" }}>{m.description}</p>

                    {/* Labels */}
                    <div>
                      <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(74,222,128,0.5)" }}>Output Labels</p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.labels.map((label) => (
                          <span key={label} className="text-xs px-2.5 py-1 rounded-lg"
                            style={{ background: `${m.color}10`, color: m.color, border: `1px solid ${m.color}25` }}>
                            {label.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Use cases */}
                    <div>
                      <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(74,222,128,0.5)" }}>Use Cases</p>
                      <p className="text-xs" style={{ color: "#71717a" }}>{m.useCase}</p>
                    </div>

                    {/* Code */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(74,222,128,0.5)" }}>
                          How to Use
                        </p>
                        <div className="flex rounded-lg overflow-hidden"
                          style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                          {["js", "python"].map((lang) => (
                            <button
                              key={lang}
                              onClick={() => setTab(m.id, lang)}
                              className="text-[10px] px-3 py-1 transition-all"
                              style={{
                                background: tab === lang ? `${m.color}20` : "transparent",
                                color:      tab === lang ? m.color         : "#52525b",
                                borderRight: lang === "js" ? "1px solid rgba(255,255,255,0.08)" : "none",
                              }}
                            >
                              {lang === "js" ? "JavaScript" : "Python"}
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
                      className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-xl font-medium transition-all"
                      style={{ background: `${m.color}15`, color: m.color, border: `1px solid ${m.color}35` }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${m.color}25`; e.currentTarget.style.boxShadow = `0 0 12px ${m.glow}`; }}
                      onMouseLeave={e => { e.currentTarget.style.background = `${m.color}15`; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      View on Hugging Face
                    </a>

                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <p className="text-xs" style={{ color: "#3f3f46" }}>
            All models are free and open · Hosted on Hugging Face Spaces · No API key needed
          </p>
        </div>

      </div>
    </div>
  );
}