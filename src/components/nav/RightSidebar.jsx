import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { EmotionBar } from "../chatbot/EmotionBar"; 
import { ModelCard } from "../chatbot/ModelCard";

export function RightSidebar({
  open,
  onToggle,
  orderedModels,
  enabledModels,
  onToggleModel,
  modelResults,
  draggedModel,
  dragOverModel,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  consensusScores,
}) {
  return (
    <>
      <aside
        className="relative flex flex-col border-l border-zinc-800/50 transition-all duration-300 ease-in-out shrink-0"
        style={{
          width: open ? 272 : 0,
          minWidth: open ? 272 : 0,
          background: "rgba(10,10,12,0.95)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-800/50 shrink-0">
          <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">
            Models
          </span>
          <span className="text-[10px] text-zinc-600">Drag to reorder</span>
        </div>

        <ScrollArea className="flex-1 h-full">
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

            {/* Ensemble consensus */}
            {consensusScores && (
              <>
                <Separator className="my-3 bg-zinc-800/60" />
                <div
                  className="rounded-xl p-3.5"
                  style={{
                    background: "rgba(74,222,128,0.04)",
                    border: "1px solid rgba(74,222,128,0.12)",
                  }}
                >
                  <p className="text-[10px] font-semibold text-[#4ade80] uppercase tracking-widest mb-3">
                    Ensemble
                  </p>
                  {Object.entries(consensusScores)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 4)
                    .map(([label, score]) => (
                      <EmotionBar
                        key={label}
                        label={label}
                        score={score}
                        color="#4ade80"
                      />
                    ))}
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Collapse button */}
        <button
          onClick={onToggle}
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors z-10"
          style={{
            background: "#18181b",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {open ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Collapsed pill */}
      {!open && (
        <div
          className="flex flex-col items-center justify-center py-4 gap-3 border-l border-zinc-800/50 shrink-0 cursor-pointer"
          style={{ width: 40, background: "rgba(10,10,12,0.95)" }}
          onClick={onToggle}
        >
          {orderedModels.slice(0, 4).map((m) => (
            <Tooltip key={m.id}>
              <TooltipTrigger>
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: enabledModels.has(m.id) ? m.color : "#27272a",
                    boxShadow: enabledModels.has(m.id)
                      ? `0 0 6px ${m.color}`
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
