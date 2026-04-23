"use client";

import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { NAV_ITEMS } from "@/lib/constants";

const NAV_COLORS = {
  chat:     "#4ade80",
  analysis: "#22d3ee",
  triage:   "#a78bfa",
  models:   "#f472b6",
  history:  "#fbbf24",
  settings: "#94a3b8",
};

export function LeftSidebar({ open, onToggle, activeTab, onTabChange, orderedModels, enabledModels }) {
  const [groupOpen, setGroupOpen] = useState(
    () => NAV_ITEMS.find((i) => i.isGroup)?.children?.some((c) => c.id === activeTab) ?? true
  );

  const USAGE_CHILD_IDS = NAV_ITEMS.find((i) => i.isGroup)?.children?.map((c) => c.id) ?? [];
  const usageActive = USAGE_CHILD_IDS.includes(activeTab);

  function renderItem(item, isChild = false) {
    const active = activeTab === item.id;
    const accent = NAV_COLORS[item.id] ?? "#4ade80";

    return (
      <Tooltip key={item.id}>
        <TooltipTrigger asChild>
          <button
            onClick={() => onTabChange(item.id)}
            className="w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150"
            style={{
              padding: isChild && open ? "8px 12px 8px 24px" : "10px 12px",
              ...(active
                ? {
                    color: accent,
                    background: `${accent}18`,
                    boxShadow: `inset 0 0 0 1px ${accent}40, 0 0 16px ${accent}10`,
                  }
                : { color: "#52525b" }),
            }}
            onMouseEnter={e => {
              if (!active) {
                e.currentTarget.style.color = accent;
                e.currentTarget.style.background = `${accent}0d`;
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                e.currentTarget.style.color = "#52525b";
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            <span className="shrink-0" style={active ? { filter: `drop-shadow(0 0 4px ${accent})` } : {}}>
              {item.icon}
            </span>
            {open && (
              <span className="whitespace-nowrap overflow-hidden flex-1 text-left">{item.label}</span>
            )}
            {open && active && (
              <div className="w-1 h-1 rounded-full shrink-0" style={{ background: accent }} />
            )}
          </button>
        </TooltipTrigger>
        {!open && <TooltipContent side="right">{item.label}</TooltipContent>}
      </Tooltip>
    );
  }

  return (
    <aside
      className="relative flex flex-col shrink-0 transition-all duration-300 ease-in-out"
      style={{
        width: open ? 220 : 56,
        background: "rgba(14,16,20,0.99)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Dotted background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* Top gradient bleed */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 160px 120px at 28px 0, rgba(74,222,128,0.1), transparent)",
        }}
      />

      {/* Logo */}
      <div
        className="h-14 flex items-center px-4 shrink-0 relative z-10"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 relative"
            style={{
              background: "linear-gradient(135deg, rgba(74,222,128,0.25) 0%, rgba(34,211,238,0.15) 100%)",
              border: "1px solid rgba(74,222,128,0.5)",
              boxShadow: "0 0 12px rgba(74,222,128,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <polygon points="12,2 22,20 2,20" stroke="#4ade80" strokeWidth="2" fill="none" />
              <circle cx="12" cy="14" r="2" fill="#4ade80" />
            </svg>
          </div>
          {open && (
            <div className="flex flex-col overflow-hidden">
              <span
                className="text-sm font-bold whitespace-nowrap"
                style={{
                  background: "linear-gradient(90deg, #4ade80, #22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "0.04em",
                }}
              >
                EmoChat
              </span>
              <span className="text-[9px] tracking-widest" style={{ color: "rgba(74,222,128,0.4)" }}>
                EMOTION AI
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 relative z-10">
        {NAV_ITEMS.map((item) => {
          if (item.isGroup) {
            return (
              <div key={item.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => open ? setGroupOpen((v) => !v) : onTabChange(item.children[0].id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                      style={usageActive ? { color: "#a78bfa", background: "rgba(167,139,250,0.1)" } : { color: "#52525b" }}
                      onMouseEnter={e => { if (!usageActive) { e.currentTarget.style.color = "#a78bfa"; e.currentTarget.style.background = "rgba(167,139,250,0.08)"; }}}
                      onMouseLeave={e => { if (!usageActive) { e.currentTarget.style.color = "#52525b"; e.currentTarget.style.background = "transparent"; }}}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      {open && (
                        <>
                          <span className="flex-1 whitespace-nowrap overflow-hidden text-left">{item.label}</span>
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                            style={{ transition: "transform 0.2s", transform: groupOpen ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.5 }}>
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </>
                      )}
                    </button>
                  </TooltipTrigger>
                  {!open && <TooltipContent side="right">{item.label}</TooltipContent>}
                </Tooltip>

                {open && groupOpen && (
                  <div className="mt-0.5 space-y-0.5 ml-4"
                    style={{ borderLeft: "1px solid rgba(167,139,250,0.15)", paddingLeft: 4 }}>
                    {item.children.map((child) => renderItem(child, true))}
                  </div>
                )}
              </div>
            );
          }
          return renderItem(item);
        })}
      </nav>

      {/* Active models */}
      {open && (
        <div
          className="px-4 py-3 relative z-10"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-[9px] uppercase tracking-[0.18em] mb-2.5" style={{ color: "rgba(255,255,255,0.2)" }}>
            Active models
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {orderedModels
              .filter((m) => enabledModels.has(m.id))
              .map((m) => (
                <div
                  key={m.id}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: m.color, boxShadow: `0 0 6px ${m.color}cc` }}
                />
              ))}
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-150 z-20"
        style={{ background: "#0e1014", border: "1px solid rgba(74,222,128,0.3)", color: "rgba(74,222,128,0.6)" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#4ade80"; e.currentTarget.style.color = "#4ade80"; e.currentTarget.style.boxShadow = "0 0 10px rgba(74,222,128,0.3)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.3)"; e.currentTarget.style.color = "rgba(74,222,128,0.6)"; e.currentTarget.style.boxShadow = "none"; }}
      >
        {open ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>
    </aside>
  );
}