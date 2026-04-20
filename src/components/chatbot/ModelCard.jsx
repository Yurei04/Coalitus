import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { EmotionBar } from "./EmotionBar"; 
import { fmt, topEmotion } from "@/lib/helpers";

export function ModelCard({
  model,
  enabled,
  onToggle,
  results,
  dragging,
  dragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) {
  const scores = results?.[model.id];
  const top = topEmotion(scores);
  const isDragging = dragging === model.id;
  const isOver = dragOver === model.id;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, model.id)}
      onDragOver={(e) => onDragOver(e, model.id)}
      onDrop={(e) => onDrop(e, model.id)}
      onDragEnd={onDragEnd}
      className={cn(
        "rounded-xl p-3.5 mb-2.5 cursor-grab select-none transition-all duration-200",
        isDragging ? "opacity-40 scale-95" : "opacity-100",
        isOver ? "scale-[1.02]" : ""
      )}
      style={{
        background: isOver ? `${model.color}08` : "rgba(255,255,255,0.03)",
        border: `1px solid ${
          isOver
            ? model.color + "50"
            : isDragging
            ? model.color + "60"
            : "rgba(255,255,255,0.07)"
        }`,
        boxShadow: isOver ? `0 0 20px ${model.glow}` : "none",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-zinc-700 cursor-grab text-sm leading-none select-none">
            ⠿
          </span>
          <div
            className="w-2 h-2 rounded-full transition-all duration-500"
            style={{
              background: enabled ? model.color : "rgba(255,255,255,0.1)",
              boxShadow: enabled ? `0 0 8px ${model.color}` : "none",
            }}
          />
          <span className="text-sm font-semibold text-zinc-200">
            {model.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
            style={{
              color: model.color,
              background: model.glow,
              border: `1px solid ${model.color}30`,
            }}
          >
            {model.badge}
          </span>
          <Switch
            checked={enabled}
            onCheckedChange={() => onToggle(model.id)}
            className="scale-75"
          />
        </div>
      </div>

      {/* Results */}
      {enabled && scores ? (
        <div>
          {Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([label, score]) => (
              <EmotionBar key={label} label={label} score={score} color={model.color} />
            ))}

          {top && (
            <div
              className="mt-2.5 px-3 py-2 rounded-lg flex items-center justify-between"
              style={{
                background: `${model.color}0d`,
                border: `1px solid ${model.color}20`,
              }}
            >
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                dominant
              </span>
              <span
                className="text-xs font-semibold capitalize"
                style={{ color: model.color }}
              >
                {top[0]} · {fmt(top[1])}
              </span>
            </div>
          )}
        </div>
      ) : enabled ? (
        <p className="text-[11px] text-zinc-600 text-center py-3">
          Awaiting input…
        </p>
      ) : (
        <p className="text-[11px] text-zinc-700 text-center py-3">
          Model disabled
        </p>
      )}
    </div>
  );
}
