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
          background: "rgba(22,24,28,0.98)",
          borderLeft: "1px solid rgba(74,222,128,0.12)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="h-14 flex items-center justify-between px-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(74,222,128,0.1)" }}
        >
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "rgba(74,222,128,0.7)" }}
          >
            Models
          </span>
          <span className="text-[10px]" style={{ color: "rgba(74,222,128,0.3)" }}>
            Drag to reorder
          </span>
        </div>

        <ScrollArea className="flex-1 min-h-full">
          <div className="p-3">
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
                <Separator className="my-3" style={{ background: "rgba(74,222,128,0.1)" }} />
                <div
                  className="rounded-xl p-3.5"
                  style={{
                    background: "rgba(74,222,128,0.07)",
                    border: "1px solid rgba(74,222,128,0.2)",
                    boxShadow: "inset 0 0 20px rgba(74,222,128,0.04)",
                  }}
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-widest mb-3"
                    style={{ color: "#4ade80", textShadow: "0 0 8px rgba(74,222,128,0.5)" }}
                  >
                    Ensemble
                  </p>
                  {Object.entries(consensusScores)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 4)
                    .map(([label, score]) => (
                      <EmotionBar key={label} label={label} score={score} color="#4ade80" />
                    ))}
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Collapse button */}
        <button
          onClick={onToggle}
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-150 z-10"
          style={{
            background: "#1e2024",
            border: "1px solid rgba(74,222,128,0.25)",
            color: "rgba(74,222,128,0.6)",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.6)"; e.currentTarget.style.color = "#4ade80"; e.currentTarget.style.boxShadow = "0 0 8px rgba(74,222,128,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.25)"; e.currentTarget.style.color = "rgba(74,222,128,0.6)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          {open ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Collapsed pill */}
      {!open && (
        <div
          className="flex flex-col items-center justify-center py-4 gap-3 shrink-0 cursor-pointer"
          style={{
            width: 40,
            background: "rgba(22,24,28,0.98)",
            borderLeft: "1px solid rgba(74,222,128,0.12)",
          }}
          onClick={onToggle}
        >
          {orderedModels.slice(0, 4).map((m) => (
            <Tooltip key={m.id}>
              <TooltipTrigger>
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: enabledModels.has(m.id) ? m.color : "#2a2d32",
                    boxShadow: enabledModels.has(m.id)
                      ? `0 0 6px ${m.color}, 0 0 14px ${m.color}50`
                      : "none",
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