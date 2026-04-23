"use client";

import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { NAV_ITEMS } from "@/lib/constants";

/* per-tab accent colours aligned to HomeView palette */
const NAV_COLORS = {
  chat:     "#39ff8e",
  analysis: "#22d3ee",
  triage:   "#a3e635",
  models:   "#fb923c",
  history:  "#e879f9",
  settings: "#94a3b8",
};

export function LeftSidebar({
  open, onToggle, activeTab, onTabChange, orderedModels, enabledModels,
}) {
  const [groupOpen, setGroupOpen] = useState(
    () => NAV_ITEMS.find((i) => i.isGroup)?.children?.some((c) => c.id === activeTab) ?? true
  );

  const USAGE_IDS    = NAV_ITEMS.find((i) => i.isGroup)?.children?.map((c) => c.id) ?? [];
  const usageActive  = USAGE_IDS.includes(activeTab);

  /* ── single nav button ── */
  function renderItem(item, isChild = false) {
    const active = activeTab === item.id;
    const accent = NAV_COLORS[item.id] ?? "#39ff8e";

    return (
      <Tooltip key={item.id}>
        <TooltipTrigger asChild>
          <button
            onClick={() => onTabChange(item.id)}
            className="w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 group/nav relative overflow-hidden"
            style={{
              padding: isChild && open ? "8px 10px 8px 20px" : "10px 10px",
              color:      active ? accent : "rgba(255,255,255,0.28)",
              background: active ? `${accent}12` : "transparent",
              border:     active ? `1px solid ${accent}28` : "1px solid transparent",
              boxShadow:  active ? `inset 0 0 20px ${accent}08` : "none",
            }}
            onMouseEnter={e => {
              if (!active) {
                e.currentTarget.style.color      = accent;
                e.currentTarget.style.background = `${accent}08`;
                e.currentTarget.style.border     = `1px solid ${accent}18`;
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                e.currentTarget.style.color      = "rgba(255,255,255,0.28)";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.border     = "1px solid transparent";
              }
            }}
          >
            {/* active left glow strip */}
            {active && (
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4/5 rounded-full"
                style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
              />
            )}

            <span
              className="shrink-0 transition-all duration-200"
              style={active ? { filter: `drop-shadow(0 0 5px ${accent})` } : {}}
            >
              {item.icon}
            </span>

            {open && (
              <span className="left-sidebar-syne whitespace-nowrap overflow-hidden flex-1 text-left text-[13px] font-semibold">
                {item.label}
              </span>
            )}

            {open && active && (
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
              />
            )}
          </button>
        </TooltipTrigger>
        {!open && (
          <TooltipContent side="right" className="left-sidebar-mono text-[11px]">
            {item.label}
          </TooltipContent>
        )}
      </Tooltip>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@600;700;800&display=swap');
        .left-sidebar-mono { font-family:'Space Mono',monospace; }
        .left-sidebar-syne { font-family:'Syne',sans-serif; }
        @keyframes ls-breathe { 0%,100%{opacity:.4;} 50%{opacity:1;} }
        .ls-pulse { animation: ls-breathe 2.2s ease-in-out infinite; }
      `}</style>

      <aside
        className="relative flex flex-col shrink-0 transition-all duration-300 ease-in-out"
        style={{
          width:       open ? 224 : 56,
          background:  "rgba(0,9,29,0.98)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* emerald bloom — top */}
        <div
          className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 180px 130px at 28px 0, rgba(57,255,142,0.1), transparent)",
          }}
        />

        {/* cyan bloom — bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 160px 100px at 28px bottom, rgba(34,211,238,0.07), transparent)",
          }}
        />

        {/* ── LOGO ── */}
        <div
          className="h-14 flex items-center px-3 shrink-0 relative z-10"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "rgba(57,255,142,0.12)",
                border: "1px solid rgba(57,255,142,0.38)",
                boxShadow: "0 0 14px rgba(57,255,142,0.2)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <polygon points="12,2 22,20 2,20" stroke="#39ff8e" strokeWidth="2" fill="none" />
                <circle cx="12" cy="14" r="2.2" fill="#39ff8e" />
              </svg>
            </div>

            {open && (
              <div className="flex flex-col overflow-hidden">
                <span
                  className="left-sidebar-syne text-[13px] font-extrabold whitespace-nowrap tracking-wide"
                  style={{
                    background: "linear-gradient(90deg,#39ff8e,#22d3ee)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Coalitus
                </span>
                <span
                  className="left-sidebar-mono text-[9px] tracking-[0.18em]"
                  style={{ color: "rgba(57,255,142,0.4)" }}
                >
                  Well Being AI
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── NAV ── */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 relative z-10 overflow-hidden">
          {NAV_ITEMS.map((item) => {
            if (item.isGroup) {
              const groupAccent = "#a3e635";
              return (
                <div key={item.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => open ? setGroupOpen(v => !v) : onTabChange(item.children[0].id)}
                        className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                        style={
                          usageActive
                            ? { color: groupAccent, background: `${groupAccent}0f`, border: `1px solid ${groupAccent}22` }
                            : { color: "rgba(255,255,255,0.28)", border: "1px solid transparent" }
                        }
                        onMouseEnter={e => {
                          if (!usageActive) {
                            e.currentTarget.style.color      = groupAccent;
                            e.currentTarget.style.background = `${groupAccent}08`;
                            e.currentTarget.style.border     = `1px solid ${groupAccent}18`;
                          }
                        }}
                        onMouseLeave={e => {
                          if (!usageActive) {
                            e.currentTarget.style.color      = "rgba(255,255,255,0.28)";
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.border     = "1px solid transparent";
                          }
                        }}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        {open && (
                          <>
                            <span className="left-sidebar-syne flex-1 whitespace-nowrap overflow-hidden text-left text-[13px] font-semibold">
                              {item.label}
                            </span>
                            <svg
                              width="11" height="11" fill="none" stroke="currentColor"
                              strokeWidth="2.5" viewBox="0 0 24 24"
                              style={{
                                transition: "transform 0.25s",
                                transform: groupOpen ? "rotate(180deg)" : "rotate(0deg)",
                                opacity: 0.45,
                              }}
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </>
                        )}
                      </button>
                    </TooltipTrigger>
                    {!open && <TooltipContent side="right">{item.label}</TooltipContent>}
                  </Tooltip>

                  {open && groupOpen && (
                    <div
                      className="mt-1 ml-3 space-y-0.5"
                      style={{ borderLeft: `1px solid rgba(163,230,53,0.14)`, paddingLeft: 6 }}
                    >
                      {item.children.map((child) => renderItem(child, true))}
                    </div>
                  )}
                </div>
              );
            }
            return renderItem(item);
          })}
        </nav>

        {/* ── active models strip ── */}
        {open && (
          <div
            className="px-4 py-3 relative z-10"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="left-sidebar-mono text-[9px] uppercase tracking-[0.2em] mb-2.5"
              style={{ color: "rgba(255,255,255,0.18)" }}>
              Active models
            </p>
            <div className="flex gap-2 flex-wrap">
              {orderedModels
                .filter(m => enabledModels.has(m.id))
                .map(m => (
                  <div
                    key={m.id}
                    className="ls-pulse w-2 h-2 rounded-full"
                    style={{ background: m.color, boxShadow: `0 0 6px ${m.color}cc` }}
                  />
                ))}
            </div>
          </div>
        )}

        {/* ── collapse toggle ── */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 z-20"
          style={{
            background:  "rgba(0,9,29,0.98)",
            border:      "1px solid rgba(57,255,142,0.28)",
            color:       "rgba(57,255,142,0.55)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#39ff8e";
            e.currentTarget.style.color       = "#39ff8e";
            e.currentTarget.style.boxShadow   = "0 0 12px rgba(57,255,142,0.3)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(57,255,142,0.28)";
            e.currentTarget.style.color       = "rgba(57,255,142,0.55)";
            e.currentTarget.style.boxShadow   = "none";
          }}
        >
          {open ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>
      </aside>
    </>
  );
}