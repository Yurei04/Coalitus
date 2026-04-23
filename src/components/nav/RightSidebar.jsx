"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { EmotionBar } from "../chatbot/EmotionBar";
import { ModelCard } from "../chatbot/ModelCard";

export function RightSidebar({
  open, onToggle,
  orderedModels, enabledModels, onToggleModel,
  modelResults, draggedModel, dragOverModel,
  onDragStart, onDragOver, onDrop, onDragEnd,
  consensusScores,
}) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');
        .rs-mono { font-family:'Space Mono',monospace; }
        .rs-syne { font-family:'Syne',sans-serif; }
        @keyframes rs-breathe { 0%,100%{opacity:.45;} 50%{opacity:1;} }
        .rs-pulse { animation:rs-breathe 2.2s ease-in-out infinite; }
        @keyframes rs-scan { 0%{left:-35%;} 100%{left:135%;} }
        .rs-scan::after {
          content:'';
          position:absolute; top:0; height:100%; width:30%;
          background:linear-gradient(90deg,transparent,rgba(34,211,238,0.6),transparent);
          animation:rs-scan 2.8s ease-in-out infinite;
        }
      `}</style>

      <>
        {/* ── open sidebar ── */}
        <aside
          className="relative flex flex-col shrink-0 transition-all duration-300 ease-in-out h-full"
          style={{
            width:      open ? 280 : 0,
            minWidth:   open ? 280 : 0,
            background: "rgba(0,9,29,0.98)",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            overflow:   "hidden",
          }}
        >
          {/* dot grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />

          {/* cyan bloom — top */}
          <div
            className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 220px 130px at right 0, rgba(34,211,238,0.1), transparent)",
            }}
          />

          {/* lime bloom — bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 200px 120px at 60px bottom, rgba(163,230,53,0.07), transparent)",
            }}
          />

          {/* ── HEADER ── */}
          <div
            className="h-14 flex items-center justify-between px-4 shrink-0 relative z-10"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="rs-pulse w-2 h-2 rounded-full"
                style={{ background: "#22d3ee", boxShadow: "0 0 8px #22d3ee" }}
              />
              <span
                className="rs-syne text-[12px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "#22d3ee" }}
              >
                Models
              </span>
            </div>
          </div>

          {/* ── SCROLL CONTENT ── */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-3 space-y-2 relative z-10">
              {orderedModels.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  enabled={enabledModels.has(model.id)}
                  onToggle={onToggleModel}
                  results={modelResults}
                  dragging={draggedModel}
                  dragOver={dragOverModel}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onDragEnd={onDragEnd}
                />
              ))}

              {/* ── ensemble consensus ── */}
              {consensusScores && (
                <>
                  <Separator
                    className="my-3"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  />

                  <div
                    className="relative rounded-xl p-4 overflow-hidden"
                    style={{
                      background: "rgba(163,230,53,0.06)",
                      border: "1px solid rgba(163,230,53,0.18)",
                    }}
                  >
                    {/* corner glow */}
                    <div
                      className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
                      style={{
                        background: "radial-gradient(circle, rgba(163,230,53,0.12), transparent)",
                        borderRadius: "50%",
                        transform: "translate(30%, -30%)",
                      }}
                    />

                    {/* top accent line */}
                    <div
                      className="absolute top-0 left-4 right-4 h-px pointer-events-none"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(163,230,53,0.4), transparent)",
                      }}
                    />

                    <div className="flex items-center gap-2 mb-3.5 relative z-10">
                      <div
                        className="rs-pulse w-1.5 h-1.5 rounded-full"
                        style={{ background: "#a3e635", boxShadow: "0 0 6px #a3e635" }}
                      />
                      <p
                        className="rs-mono text-[10px] font-bold uppercase tracking-[0.2em]"
                        style={{ color: "#a3e635" }}
                      >
                        Ensemble
                      </p>
                    </div>

                    <div className="space-y-1 relative z-10">
                      {Object.entries(consensusScores)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 4)
                        .map(([label, score]) => (
                          <EmotionBar key={label} label={label} score={score} color="#a3e635" />
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          {/* ── collapse toggle ── */}
          <button
            onClick={onToggle}
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 z-20"
            style={{
              background:  "rgba(0,9,29,0.98)",
              border:      "1px solid rgba(34,211,238,0.28)",
              color:       "rgba(34,211,238,0.55)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "#22d3ee";
              e.currentTarget.style.color       = "#22d3ee";
              e.currentTarget.style.boxShadow   = "0 0 12px rgba(34,211,238,0.3)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "rgba(34,211,238,0.28)";
              e.currentTarget.style.color       = "rgba(34,211,238,0.55)";
              e.currentTarget.style.boxShadow   = "none";
            }}
          >
            {open ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </aside>

        {/* ── collapsed icon strip ── */}
        {!open && (
          <div
            className="flex flex-col items-center justify-center py-4 gap-3.5 shrink-0 cursor-pointer relative"
            style={{
              width:      40,
              background: "rgba(0,9,29,0.98)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
            }}
            onClick={onToggle}
          >
            {/* dot grid on strip */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />

            {orderedModels.slice(0, 4).map((m) => (
              <Tooltip key={m.id}>
                <TooltipTrigger asChild>
                  <div
                    className="w-2.5 h-2.5 rounded-full transition-all duration-200 cursor-pointer relative z-10"
                    style={{
                      background: enabledModels.has(m.id) ? m.color : "rgba(255,255,255,0.08)",
                      boxShadow:  enabledModels.has(m.id) ? `0 0 8px ${m.color}cc` : "none",
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent side="left" className="rs-mono text-[11px]">
                  {m.name}
                </TooltipContent>
              </Tooltip>
            ))}

            {/* expand hint */}
            <div
              className="rs-pulse absolute bottom-3 w-4 h-px rounded"
              style={{ background: "rgba(34,211,238,0.4)" }}
            />
          </div>
        )}
      </>
    </>
  );
}