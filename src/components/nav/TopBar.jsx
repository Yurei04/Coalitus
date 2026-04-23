"use client";

import { MODELS } from "@/lib/constants";

const TAB_META = {
  chat:     { color: "#39ff8e", label: "Chat",     glyph: "◈" },
  analysis: { color: "#22d3ee", label: "Analysis", glyph: "◉" },
  triage:   { color: "#a3e635", label: "Triage",   glyph: "◎" },
  models:   { color: "#fb923c", label: "Models",   glyph: "◆" },
  history:  { color: "#e879f9", label: "History",  glyph: "◇" },
  settings: { color: "#94a3b8", label: "Settings", glyph: "◌" },
};

export function TopBar({ activeTab, enabledModels }) {
  const tm = TAB_META[activeTab] ?? TAB_META.chat;
  const activeCount = enabledModels.size;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');
        .topbar-mono { font-family: 'Space Mono', monospace; }
        .topbar-syne { font-family: 'Syne', sans-serif; }
        @keyframes topbar-scan {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%);  }
        }
        @keyframes topbar-breathe {
          0%,100% { opacity:.5; }
          50%     { opacity:1;  }
        }
        .topbar-dot-pulse { animation: topbar-breathe 2s ease-in-out infinite; }
        .topbar-scan-bar  { animation: topbar-scan 3s ease-in-out infinite; }
      `}</style>

      <div
        className="relative h-14 flex items-center px-5 gap-4 shrink-0 overflow-hidden"
        style={{
          background: "rgba(0,9,29,0.97)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* top accent line — single active-tab color */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${tm.color}90, transparent)` }}
        />

        {/* moving scan highlight under the line */}
        <div className="absolute top-0 left-0 w-24 h-5 pointer-events-none overflow-hidden">
          <div
            className="topbar-scan-bar absolute top-0 left-0 w-12 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${tm.color}, transparent)` }}
          />
        </div>

        {/* ambient glow blob */}
        <div
          className="absolute top-0 left-0 w-72 h-14 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 260px 56px at 80px 0, ${tm.color}12, transparent)`,
          }}
        />

        {/* ── active tab badge ── */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div
            className="topbar-dot-pulse w-2 h-2 rounded-full shrink-0"
            style={{ background: tm.color, boxShadow: `0 0 8px ${tm.color}, 0 0 18px ${tm.color}60` }}
          />
          <span
            className="topbar-mono text-[11px] font-bold tracking-[0.16em] uppercase"
            style={{ color: tm.color }}
          >
            {tm.label}
          </span>
        </div>

        {/* divider */}
        <div className="w-px h-4 shrink-0 relative z-10" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* models active pill */}
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full relative z-10"
          style={{
            background: "rgba(57,255,142,0.06)",
            border: "1px solid rgba(57,255,142,0.18)",
          }}
        >
          <div
            className="topbar-dot-pulse w-1.5 h-1.5 rounded-full"
            style={{ background: "#39ff8e", boxShadow: "0 0 6px #39ff8e" }}
          />
          <span className="topbar-mono text-[10px] font-bold tracking-wide" style={{ color: "#39ff8e" }}>
            {activeCount}/{MODELS.length} models
          </span>
        </div>

        {/* ── right side model color dots ── */}
        <div className="ml-auto flex items-center gap-3 relative z-10">
          {MODELS.map((m) => {
            const on = enabledModels.has(m.id);
            return (
              <div key={m.id} className="flex items-center gap-1.5 group">
                <div
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    background: on ? m.color : "rgba(255,255,255,0.1)",
                    boxShadow: on ? `0 0 6px ${m.color}` : "none",
                  }}
                />
                <span
                  className="topbar-mono text-[9px] tracking-widest hidden xl:block transition-colors duration-300"
                  style={{ color: on ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)" }}
                >
                  {m.id}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}