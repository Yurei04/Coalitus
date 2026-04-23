"use client";

import { useState, useEffect, useRef } from "react";
import { MY_MODELS } from "@/lib/constants";

/* ── Scan-line emotion ticker ── */
const EMOTIONS = ["joy", "curiosity", "sadness", "anger", "surprise", "fear", "love", "anxiety", "calm", "hope"];

function EmotionTicker() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % EMOTIONS.length);
        setVisible(true);
      }, 300);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      style={{
        display: "inline-block",
        color: "#39ff8e",
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700,
        letterSpacing: "0.08em",
        minWidth: 160,
        transition: "opacity 0.3s, transform 0.3s",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-8px)",
      }}
    >
      {EMOTIONS[idx]}
    </span>
  );
}

/* ── Animated scan bar ── */
function ScanBar() {
  return (
    <div style={{ position: "relative", width: "100%", height: 2, background: "rgba(57,255,142,0.12)", borderRadius: 2, overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: 0, left: 0, height: "100%", width: "40%",
        background: "linear-gradient(90deg, transparent, #39ff8e, transparent)",
        animation: "scan 2.4s ease-in-out infinite",
      }} />
    </div>
  );
}

/* ── Floating stat card ── */
function StatCard({ value, label, color, delay = 0 }) {
  return (
    <div style={{
      padding: "14px 20px",
      borderRadius: 14,
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${color}30`,
      boxShadow: `0 0 24px ${color}12`,
      animationDelay: `${delay}ms`,
      animation: "floatUp 0.8s ease both",
    }}>
      <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "'Space Mono', monospace", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {label}
      </div>
    </div>
  );
}

/* ── Model card ── */
function ModelCard({ model, idx }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "28px 24px",
        borderRadius: 20,
        background: hovered ? `${model.color}0e` : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? model.color + "50" : model.color + "20"}`,
        boxShadow: hovered ? `0 0 40px ${model.color}20, inset 0 0 30px ${model.color}08` : "none",
        transition: "all 0.35s ease",
        cursor: "default",
        overflow: "hidden",
        animation: `floatUp 0.7s ease both`,
        animationDelay: `${idx * 120 + 200}ms`,
      }}
    >
      {/* Corner glow */}
      <div style={{
        position: "absolute", top: -30, right: -30, width: 120, height: 120,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${model.color}20, transparent 70%)`,
        transition: "opacity 0.35s",
        opacity: hovered ? 1 : 0,
      }} />

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{
          fontSize: 28,
          width: 52, height: 52,
          borderRadius: 14,
          background: `${model.color}15`,
          border: `1px solid ${model.color}35`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: hovered ? `0 0 16px ${model.color}30` : "none",
          transition: "box-shadow 0.35s",
        }}>
          {model.emoji}
        </div>
        <span style={{
          fontSize: 10, fontFamily: "'Space Mono', monospace",
          padding: "4px 10px", borderRadius: 20,
          background: `${model.color}18`,
          border: `1px solid ${model.color}35`,
          color: model.color,
          letterSpacing: "0.1em",
        }}>
          {model.badge}
        </span>
      </div>

      {/* Name */}
      <div style={{ fontSize: 17, fontWeight: 700, color: "#f0fdf4", marginBottom: 6, letterSpacing: "-0.01em" }}>
        {model.name}
      </div>

      {/* Architecture */}
      <div style={{ fontSize: 11, color: model.color, opacity: 0.7, fontFamily: "'Space Mono', monospace", marginBottom: 12, letterSpacing: "0.04em" }}>
        {model.architecture}
      </div>

      {/* Description */}
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 16 }}>
        {model.description}
      </div>

      {/* Labels */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {model.labels.slice(0, 5).map((l) => (
          <span key={l} style={{
            fontSize: 10, padding: "3px 8px", borderRadius: 6,
            background: `${model.color}10`,
            border: `1px solid ${model.color}25`,
            color: "rgba(255,255,255,0.45)",
            fontFamily: "'Space Mono', monospace",
            letterSpacing: "0.04em",
          }}>
            {l}
          </span>
        ))}
        {model.labels.length > 5 && (
          <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, color: "rgba(255,255,255,0.25)" }}>
            +{model.labels.length - 5}
          </span>
        )}
      </div>

      {/* Use case */}
      <div style={{
        marginTop: 16, paddingTop: 16,
        borderTop: `1px solid ${model.color}15`,
        fontSize: 11, color: "rgba(255,255,255,0.3)",
        letterSpacing: "0.05em",
      }}>
        {model.useCase}
      </div>
    </div>
  );
}

/* ── Feature step ── */
function FeatureStep({ num, title, desc, color, icon }) {
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      <div style={{
        flexShrink: 0,
        width: 44, height: 44,
        borderRadius: 12,
        background: `${color}15`,
        border: `1px solid ${color}35`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18,
        boxShadow: `0 0 16px ${color}20`,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 13, color, fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em", marginBottom: 6 }}>
          0{num}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#f0fdf4", marginBottom: 6 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>
          {desc}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN HOMEPAGE
══════════════════════════════════════════ */
export function HomeView({ onEnter }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;500;600;700;800&display=swap');

        @keyframes floatUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scan {
          0%   { left: -40%; }
          100% { left: 140%; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(110px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(110px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: rotate(120deg) translateX(90px) rotate(-120deg); }
          to   { transform: rotate(480deg) translateX(90px) rotate(-480deg); }
        }
        @keyframes orbit3 {
          from { transform: rotate(240deg) translateX(70px) rotate(-240deg); }
          to   { transform: rotate(600deg) translateX(70px) rotate(-600deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50%       { transform: scale(1.06); opacity: 1; }
        }
        .enter-btn:hover {
          background: linear-gradient(135deg, #39ff8e, #22d3ee) !important;
          box-shadow: 0 0 40px rgba(57,255,142,0.5), 0 0 80px rgba(34,211,238,0.25) !important;
          transform: translateY(-2px) scale(1.02) !important;
        }
        .enter-btn:active {
          transform: translateY(0) scale(0.99) !important;
        }
        .hf-link:hover {
          color: #39ff8e !important;
          border-color: rgba(57,255,142,0.4) !important;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#060d08",
        color: "#e2faea",
        fontFamily: "'Syne', sans-serif",
        overflowX: "hidden",
      }}>

        {/* ── Dot grid background ── */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "radial-gradient(circle, rgba(57,255,142,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        {/* ── Ambient color bleeds ── */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", top: -200, left: -150, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(57,255,142,0.1) 0%, transparent 65%)" }} />
          <div style={{ position: "absolute", top: -100, right: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 65%)" }} />
          <div style={{ position: "absolute", bottom: -200, left: "30%", width: 800, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(163,230,53,0.06) 0%, transparent 65%)" }} />
        </div>

        {/* ════════════════ NAVBAR ════════════════ */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 40px", height: 64,
          background: "rgba(6,13,8,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(57,255,142,0.1)",
          animation: "floatUp 0.5s ease both",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "linear-gradient(135deg, rgba(57,255,142,0.25), rgba(34,211,238,0.15))",
              border: "1px solid rgba(57,255,142,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 14px rgba(57,255,142,0.3)",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <polygon points="12,2 22,20 2,20" stroke="#39ff8e" strokeWidth="2" fill="none" />
                <circle cx="12" cy="14" r="2.5" fill="#39ff8e" />
              </svg>
            </div>
            <span style={{
              fontSize: 17, fontWeight: 800, letterSpacing: "0.05em",
              background: "linear-gradient(90deg, #39ff8e, #22d3ee)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              EmoChat
            </span>
            <span style={{
              fontSize: 10, padding: "2px 8px", borderRadius: 20,
              background: "rgba(57,255,142,0.1)", border: "1px solid rgba(57,255,142,0.25)",
              color: "#39ff8e", fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em",
            }}>
              BETA
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {["About", "Models", "How It Works"].map((label) => (
              <a key={label} href={`#${label.toLowerCase().replace(/ /g, "-")}`} style={{
                fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none",
                letterSpacing: "0.04em", transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#39ff8e"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
              >
                {label}
              </a>
            ))}
          </div>

          <button
            onClick={onEnter}
            className="enter-btn"
            style={{
              padding: "9px 22px", borderRadius: 12, border: "none",
              background: "rgba(57,255,142,0.12)",
              border: "1px solid rgba(57,255,142,0.35)",
              color: "#39ff8e", fontSize: 13, fontWeight: 700,
              fontFamily: "'Syne', sans-serif", letterSpacing: "0.06em",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
          >
            Launch App →
          </button>
        </nav>

        {/* ════════════════ HERO ════════════════ */}
        <section style={{
          position: "relative", zIndex: 10,
          minHeight: "92vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "80px 40px 60px",
          textAlign: "center",
        }}>
          {/* Orbiting dots graphic */}
          <div style={{
            position: "absolute", top: "15%", right: "8%",
            width: 240, height: 240,
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: 0.5,
          }}>
            {/* Center */}
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              background: "#39ff8e",
              boxShadow: "0 0 20px #39ff8e",
              animation: "breathe 3s ease-in-out infinite",
            }} />
            {/* Rings */}
            {[110, 90, 70].map((r, i) => (
              <div key={i} style={{
                position: "absolute", width: r*2, height: r*2,
                borderRadius: "50%",
                border: `1px dashed ${["rgba(57,255,142,0.2)", "rgba(34,211,238,0.15)", "rgba(163,230,53,0.12)"][i]}`,
              }} />
            ))}
            {/* Orbiting dots */}
            <div style={{ position: "absolute", top: "50%", left: "50%", animation: "orbit 4s linear infinite" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#39ff8e", boxShadow: "0 0 8px #39ff8e", marginLeft: -4, marginTop: -4 }} />
            </div>
            <div style={{ position: "absolute", top: "50%", left: "50%", animation: "orbit2 6s linear infinite" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3ee", boxShadow: "0 0 6px #22d3ee", marginLeft: -3, marginTop: -3 }} />
            </div>
            <div style={{ position: "absolute", top: "50%", left: "50%", animation: "orbit3 5s linear infinite" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#a3e635", boxShadow: "0 0 5px #a3e635", marginLeft: -2.5, marginTop: -2.5 }} />
            </div>
          </div>

          {/* Second graphic — bottom left */}
          <div style={{
            position: "absolute", bottom: "10%", left: "6%",
            width: 160, height: 160,
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: 0.3,
          }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                position: "absolute",
                width: i * 50, height: i * 50,
                borderRadius: "50%",
                border: "1px solid rgba(34,211,238,0.3)",
                animation: `pulse-ring ${i * 1.2 + 1}s ease-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }} />
            ))}
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#22d3ee", boxShadow: "0 0 12px #22d3ee" }} />
          </div>

          {/* Eyebrow pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 18px", borderRadius: 40,
            background: "rgba(57,255,142,0.08)",
            border: "1px solid rgba(57,255,142,0.22)",
            marginBottom: 32,
            animation: "floatUp 0.6s ease both",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#39ff8e", boxShadow: "0 0 6px #39ff8e" }} />
            <span style={{ fontSize: 12, color: "rgba(57,255,142,0.85)", fontFamily: "'Space Mono', monospace", letterSpacing: "0.12em" }}>
              MENTAL HEALTH · EMOTION AI
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(42px, 7vw, 88px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            margin: "0 0 16px",
            animation: "floatUp 0.7s ease both",
            animationDelay: "80ms",
          }}>
            <span style={{
              background: "linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 50%, #86efac 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Your AI reads
            </span>
            <br />
            <span style={{
              background: "linear-gradient(135deg, #39ff8e, #22d3ee, #a3e635)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              animation: "shimmer 4s linear infinite",
            }}>
              every emotion.
            </span>
          </h1>

          {/* Emotion ticker */}
          <div style={{
            fontSize: "clamp(16px, 2.5vw, 22px)",
            color: "rgba(255,255,255,0.45)",
            marginBottom: 48,
            animation: "floatUp 0.7s ease both",
            animationDelay: "160ms",
          }}>
            Currently detecting: <EmotionTicker /> in real time
          </div>

          {/* Scan bar */}
          <div style={{ width: "min(480px, 90%)", marginBottom: 52, animation: "floatUp 0.7s ease both", animationDelay: "200ms" }}>
            <ScanBar />
          </div>

          {/* CTA buttons */}
          <div style={{
            display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center",
            animation: "floatUp 0.8s ease both", animationDelay: "280ms",
          }}>
            <button
              onClick={onEnter}
              className="enter-btn"
              style={{
                padding: "16px 40px", borderRadius: 16, border: "none",
                background: "linear-gradient(135deg, #2bde72, #18c4d4)",
                color: "#020d05", fontSize: 15, fontWeight: 800,
                fontFamily: "'Syne', sans-serif", letterSpacing: "0.06em",
                cursor: "pointer",
                boxShadow: "0 0 30px rgba(57,255,142,0.35), 0 0 60px rgba(34,211,238,0.15)",
                transition: "all 0.25s ease",
              }}
            >
              Start Chatting →
            </button>
            <a
              href="#about"
              style={{
                padding: "16px 36px", borderRadius: 16,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.65)", fontSize: 15, fontWeight: 600,
                fontFamily: "'Syne', sans-serif", letterSpacing: "0.04em",
                cursor: "pointer", textDecoration: "none",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(57,255,142,0.3)"; e.currentTarget.style.color = "#a3e635"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
            >
              Learn More
            </a>
          </div>

          {/* Stats row */}
          <div style={{
            display: "flex", gap: 16, marginTop: 64, flexWrap: "wrap", justifyContent: "center",
            animation: "floatUp 0.9s ease both", animationDelay: "380ms",
          }}>
            <StatCard value="4" label="Custom Models" color="#39ff8e" delay={0} />
            <StatCard value="28" label="Max Emotion Classes" color="#22d3ee" delay={80} />
            <StatCard value="3.5K" label="Training Conversations" color="#a3e635" delay={160} />
            <StatCard value="Real-time" label="Analysis Speed" color="#fb923c" delay={240} />
          </div>
        </section>

        {/* ════════════════ ABOUT ════════════════ */}
        <section id="about" style={{
          position: "relative", zIndex: 10,
          maxWidth: 900, margin: "0 auto",
          padding: "100px 40px",
        }}>
          <div style={{ marginBottom: 20, fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#39ff8e", letterSpacing: "0.2em" }}>
            / ABOUT
          </div>
          <h2 style={{
            fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 800,
            letterSpacing: "-0.025em", lineHeight: 1.1,
            marginBottom: 32,
            background: "linear-gradient(135deg, #f0fdf4, #bbf7d0)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Emotions are data.<br />Let's treat them that way.
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 680, marginBottom: 24 }}>
            EmoChat is a mental-health NLP platform that layers multiple fine-tuned language models on top of every conversation. Instead of a single sentiment score, you get a living, breathing emotional profile — updated with each message.
          </p>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 680 }}>
            Built with counselors, students, and researchers in mind — from detecting CBT cognitive distortions to routing support topics — every model has a real-world use case in emotional intelligence.
          </p>

          {/* Divider */}
          <div style={{ marginTop: 60, height: 1, background: "linear-gradient(90deg, transparent, rgba(57,255,142,0.2), transparent)" }} />
        </section>

        {/* ════════════════ OUR MODELS ════════════════ */}
        <section id="models" style={{ position: "relative", zIndex: 10, padding: "20px 40px 100px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 16, fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#22d3ee", letterSpacing: "0.2em" }}>
            / OUR MODELS
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <h2 style={{
              fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 800,
              letterSpacing: "-0.025em", lineHeight: 1.1, margin: 0,
              background: "linear-gradient(135deg, #f0fdf4, #7dd3fc)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              4 models, trained in-house.<br />Each one purpose-built.
            </h2>
            <span style={{
              fontSize: 13, color: "rgba(255,255,255,0.3)",
              fontFamily: "'Space Mono', monospace",
            }}>
              Hosted on Hugging Face Spaces
            </span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}>
            {MY_MODELS.map((model, i) => (
              <ModelCard key={model.id} model={model} idx={i} />
            ))}
          </div>
        </section>

        {/* ════════════════ HOW IT WORKS ════════════════ */}
        <section id="how-it-works" style={{
          position: "relative", zIndex: 10,
          padding: "0 40px 100px",
          maxWidth: 1100, margin: "0 auto",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60, alignItems: "center",
          }}>
            {/* Left: steps */}
            <div>
              <div style={{ marginBottom: 16, fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#a3e635", letterSpacing: "0.2em" }}>
                / HOW IT WORKS
              </div>
              <h2 style={{
                fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800,
                letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: 44,
                background: "linear-gradient(135deg, #f0fdf4, #d9f99d)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Real-time emotion<br />intelligence, layered.
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <FeatureStep
                  num={1} icon="💬" color="#39ff8e"
                  title="You send a message"
                  desc="Type naturally. The chat processes your message through the AI assistant while simultaneously routing it to our emotion analysis pipeline."
                />
                <FeatureStep
                  num={2} icon="⚡" color="#22d3ee"
                  title="Multi-model analysis fires"
                  desc="Up to 4 HuggingFace models run in parallel — each detecting different dimensions of emotion, topic, and cognitive pattern."
                />
                <FeatureStep
                  num={3} icon="📊" color="#a3e635"
                  title="Ensemble consensus forms"
                  desc="Results are aggregated into a weighted consensus score — the sidebar shows individual model reads AND the combined signal."
                />
                <FeatureStep
                  num={4} icon="🧠" color="#fb923c"
                  title="Triage routes the insight"
                  desc="The Triage view uses our Mental Health Topic Router to classify what kind of support is needed — anxiety, grief, CBT, and more."
                />
              </div>
            </div>

            {/* Right: visual terminal card */}
            <div style={{
              padding: 32, borderRadius: 24,
              background: "rgba(57,255,142,0.03)",
              border: "1px solid rgba(57,255,142,0.15)",
              boxShadow: "0 0 60px rgba(57,255,142,0.07)",
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              lineHeight: 1.8,
            }}>
              {/* Terminal header */}
              <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
                {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
                <span style={{ marginLeft: 8, color: "rgba(255,255,255,0.2)", fontSize: 10 }}>emotion-pipeline.log</span>
              </div>

              {[
                { label: "INPUT", value: `"I feel overwhelmed lately"`, color: "rgba(255,255,255,0.5)" },
                { label: "HARTMANN", value: "sadness: 0.61  fear: 0.22", color: "#4ade80" },
                { label: "SAMLOWE", value: "nervousness: 0.44  grief: 0.31", color: "#38bdf8" },
                { label: "BHADRESH", value: "sadness: 0.73  fear: 0.18", color: "#e879f9" },
                { label: "TOPIC", value: "anxiety → depression → stress", color: "#fb923c" },
                { label: "DISTORTION", value: "catastrophizing: 0.58 ✓", color: "#facc15" },
                { label: "ENSEMBLE", value: "primary: sadness [0.67]", color: "#a3e635" },
                { label: "TRIAGE", value: "route → anxiety support", color: "#22d3ee" },
              ].map(({ label, value, color }, i) => (
                <div key={label} style={{ display: "flex", gap: 12, marginBottom: 6 }}>
                  <span style={{ color: "rgba(255,255,255,0.2)", minWidth: 80 }}>{label}</span>
                  <span style={{ color }}>→ {value}</span>
                </div>
              ))}

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(57,255,142,0.1)" }}>
                <ScanBar />
                <div style={{ marginTop: 10, color: "rgba(57,255,142,0.4)", fontSize: 10, letterSpacing: "0.08em" }}>
                  PIPELINE READY · 4 MODELS ACTIVE
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ CTA ════════════════ */}
        <section style={{
          position: "relative", zIndex: 10,
          padding: "60px 40px 120px",
          textAlign: "center",
        }}>
          {/* CTA glow blob */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600, height: 300, borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(57,255,142,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative" }}>
            <h2 style={{
              fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 800,
              letterSpacing: "-0.03em", lineHeight: 1.05,
              marginBottom: 20,
            }}>
              <span style={{
                background: "linear-gradient(135deg, #39ff8e, #22d3ee, #a3e635)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                animation: "shimmer 4s linear infinite",
              }}>
                Ready to feel understood?
              </span>
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.4)", marginBottom: 44, maxWidth: 480, margin: "0 auto 44px" }}>
              Open the app, start a conversation, and watch the emotional intelligence unfold in real time.
            </p>

            <button
              onClick={onEnter}
              className="enter-btn"
              style={{
                padding: "20px 56px", borderRadius: 20, border: "none",
                background: "linear-gradient(135deg, #2bde72, #18c4d4)",
                color: "#020d05", fontSize: 17, fontWeight: 800,
                fontFamily: "'Syne', sans-serif", letterSpacing: "0.08em",
                cursor: "pointer",
                boxShadow: "0 0 40px rgba(57,255,142,0.4), 0 0 80px rgba(34,211,238,0.2)",
                transition: "all 0.25s ease",
              }}
            >
              Open EmoChat →
            </button>
          </div>
        </section>

        {/* ════════════════ FOOTER ════════════════ */}
        <footer style={{
          position: "relative", zIndex: 10,
          padding: "24px 40px",
          borderTop: "1px solid rgba(57,255,142,0.08)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#39ff8e", boxShadow: "0 0 6px #39ff8e" }} />
            <span style={{ fontSize: 12, fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}>
              EMOCHAT · EMOTION AI PLATFORM
            </span>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {MY_MODELS.map((m) => (
              <a
                key={m.id}
                href={m.hfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hf-link"
                style={{
                  fontSize: 11, fontFamily: "'Space Mono', monospace",
                  color: "rgba(255,255,255,0.25)", textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "4px 10px", borderRadius: 6,
                  letterSpacing: "0.06em",
                  transition: "all 0.2s",
                }}
              >
                {m.emoji} {m.id}
              </a>
            ))}
          </div>
        </footer>

      </div>
    </>
  );
}