import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { EmotionBar } from "../chatbot/EmotionBar";
import { ModelCard } from "../chatbot/ModelCard";

export function RightSidebar({
  open, onToggle, orderedModels, enabledModels, onToggleModel,
  modelResults, draggedModel, dragOverModel,
  onDragStart, onDragOver, onDrop, onDragEnd, consensusScores,
}) {
  return (
    <>
      <aside
        className="relative flex flex-col shrink-0 transition-all duration-300 ease-in-out"
        style={{
          width: open ? 272 : 0,
          minWidth: open ? 272 : 0,
          background: "rgba(14,16,20,0.99)",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        {/* Dotted texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Cyan ambient top-right */}
        <div
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 200px 120px at right 0, rgba(34,211,238,0.08), transparent)",
          }}
        />

        {/* Purple ambient bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 200px 160px at 80px bottom, rgba(167,139,250,0.07), transparent)",
          }}
        />

        {/* Header */}
        <div
          className="h-14 flex items-center justify-between px-4 shrink-0 relative z-10"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#22d3ee", boxShadow: "0 0 6px #22d3ee" }}
            />
            <span
              className="text-xs font-bold uppercase tracking-[0.15em]"
              style={{ color: "#22d3ee" }}
            >
              Models
            </span>
          </div>
          <span
            className="text-[10px] tracking-wide px-2 py-0.5 rounded-full"
            style={{ color: "rgba(34,211,238,0.4)", border: "1px solid rgba(34,211,238,0.12)", background: "rgba(34,211,238,0.05)" }}
          >
            drag to reorder
          </span>
        </div>

        <ScrollArea className="flex-1 min-h-full">
          <div className="p-3 relative z-10">
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

            {consensusScores && (
              <>
                <Separator className="my-3" style={{ background: "rgba(255,255,255,0.06)" }} />
                <div
                  className="rounded-xl p-3.5 relative overflow-hidden"
                  style={{
                    background: "rgba(167,139,250,0.07)",
                    border: "1px solid rgba(167,139,250,0.2)",
                  }}
                >
                  {/* Purple inner glow */}
                  <div
                    className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
                    style={{
                      background: "radial-gradient(circle, rgba(167,139,250,0.15), transparent)",
                      borderRadius: "50%",
                    }}
                  />
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#a78bfa", boxShadow: "0 0 6px #a78bfa" }} />
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "#a78bfa" }}>
                      Ensemble
                    </p>
                  </div>
                  {Object.entries(consensusScores)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 4)
                    .map(([label, score]) => (
                      <EmotionBar key={label} label={label} score={score} color="#a78bfa" />
                    ))}
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Collapse button */}
        <button
          onClick={onToggle}
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-150 z-20"
          style={{ background: "#0e1014", border: "1px solid rgba(34,211,238,0.3)", color: "rgba(34,211,238,0.6)" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#22d3ee"; e.currentTarget.style.color = "#22d3ee"; e.currentTarget.style.boxShadow = "0 0 10px rgba(34,211,238,0.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(34,211,238,0.3)"; e.currentTarget.style.color = "rgba(34,211,238,0.6)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          {open ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {!open && (
        <div
          className="flex flex-col items-center justify-center py-4 gap-3 shrink-0 cursor-pointer relative"
          style={{
            width: 40,
            background: "rgba(14,16,20,0.99)",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
          }}
          onClick={onToggle}
        >
          {orderedModels.slice(0, 4).map((m) => (
            <Tooltip key={m.id}>
              <TooltipTrigger>
                <div
                  className="w-2.5 h-2.5 rounded-full transition-all duration-200"
                  style={{
                    background: enabledModels.has(m.id) ? m.color : "#27272a",
                    boxShadow: enabledModels.has(m.id) ? `0 0 8px ${m.color}cc` : "none",
                  }}
                />
              </TooltipTrigger>
              <TooltipContent side="left">{m.name}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}
    </>
  );
}