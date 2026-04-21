"use client";

import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { NAV_ITEMS } from "@/lib/constants";

export function LeftSidebar({ open, onToggle, activeTab, onTabChange, orderedModels, enabledModels }) {
  // "usage" group starts open if the active tab is one of its children
  const [groupOpen, setGroupOpen] = useState(
    () => NAV_ITEMS.find((i) => i.isGroup)?.children?.some((c) => c.id === activeTab) ?? true
  );

  const USAGE_CHILD_IDS = NAV_ITEMS.find((i) => i.isGroup)?.children?.map((c) => c.id) ?? [];
  const usageActive = USAGE_CHILD_IDS.includes(activeTab);

  function renderItem(item, isChild = false) {
    const active = activeTab === item.id;
    const indent = isChild && open;

    return (
      <Tooltip key={item.id}>
        <TooltipTrigger asChild>
          <button
            onClick={() => onTabChange(item.id)}
            className={cn("w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150")}
            style={{
              padding: indent ? "8px 12px 8px 28px" : "10px 12px",
              ...(active
                ? {
                    color: "#4ade80",
                    background: "rgba(74,222,128,0.12)",
                    boxShadow: "inset 0 0 0 1px rgba(74,222,128,0.3), 0 0 12px rgba(74,222,128,0.08)",
                    textShadow: "0 0 10px rgba(74,222,128,0.4)",
                  }
                : { color: "#71717a" }),
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.color = "#a1f0c4"; e.currentTarget.style.background = "rgba(74,222,128,0.06)"; } }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.color = "#71717a"; e.currentTarget.style.background = "transparent"; } }}
          >
            <span className="shrink-0">{item.icon}</span>
            {open && <span className="whitespace-nowrap overflow-hidden">{item.label}</span>}
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
        background: "rgba(22,24,28,0.98)",
        borderRight: "1px solid rgba(74,222,128,0.12)",
      }}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 shrink-0"
        style={{ borderBottom: "1px solid rgba(74,222,128,0.1)" }}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "rgba(74,222,128,0.18)",
              border: "1px solid rgba(74,222,128,0.45)",
              boxShadow: "0 0 10px rgba(74,222,128,0.2), inset 0 0 8px rgba(74,222,128,0.08)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <polygon points="12,2 22,20 2,20" stroke="#4ade80" strokeWidth="2" fill="none" />
              <circle cx="12" cy="14" r="2" fill="#4ade80" />
            </svg>
          </div>
          {open && (
            <span className="text-sm font-semibold whitespace-nowrap overflow-hidden"
              style={{ color: "#d1fae5", letterSpacing: "0.02em" }}>
              EmoChat
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          /* ── Group (Usage dropdown) ── */
          if (item.isGroup) {
            return (
              <div key={item.id}>
                {/* Group header button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        if (open) setGroupOpen((v) => !v);
                        // collapsed sidebar: clicking the group icon opens to first child
                        else onTabChange(item.children[0].id);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                      style={
                        usageActive
                          ? {
                              color: "#4ade80",
                              background: "rgba(74,222,128,0.10)",
                              boxShadow: "inset 0 0 0 1px rgba(74,222,128,0.25)",
                            }
                          : { color: "#71717a" }
                      }
                      onMouseEnter={e => { if (!usageActive) { e.currentTarget.style.color = "#a1f0c4"; e.currentTarget.style.background = "rgba(74,222,128,0.06)"; } }}
                      onMouseLeave={e => { if (!usageActive) { e.currentTarget.style.color = "#71717a"; e.currentTarget.style.background = "transparent"; } }}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      {open && (
                        <>
                          <span className="flex-1 whitespace-nowrap overflow-hidden text-left">{item.label}</span>
                          {/* Chevron */}
                          <svg
                            width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                            style={{
                              transition: "transform 0.2s",
                              transform: groupOpen ? "rotate(180deg)" : "rotate(0deg)",
                              opacity: 0.5,
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

                {/* Children — only visible when sidebar is open AND group is open */}
                {open && groupOpen && (
                  <div className="mt-0.5 space-y-0.5"
                    style={{ borderLeft: "1px solid rgba(74,222,128,0.12)", marginLeft: 20 }}>
                    {item.children.map((child) => renderItem(child, true))}
                  </div>
                )}
              </div>
            );
          }

          /* ── Regular item ── */
          return renderItem(item);
        })}
      </nav>

      {/* Active model dots */}
      {open && (
        <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(74,222,128,0.1)" }}>
          <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(74,222,128,0.5)" }}>
            Active models
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {orderedModels
              .filter((m) => enabledModels.has(m.id))
              .map((m) => (
                <div
                  key={m.id}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: m.color, boxShadow: `0 0 6px ${m.color}, 0 0 12px ${m.color}60` }}
                />
              ))}
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-150 z-10"
        style={{ background: "#1e2024", border: "1px solid rgba(74,222,128,0.25)", color: "rgba(74,222,128,0.6)" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.6)"; e.currentTarget.style.color = "#4ade80"; e.currentTarget.style.boxShadow = "0 0 8px rgba(74,222,128,0.2)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.25)"; e.currentTarget.style.color = "rgba(74,222,128,0.6)"; e.currentTarget.style.boxShadow = "none"; }}
      >
        {open ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>
    </aside>
  );
}