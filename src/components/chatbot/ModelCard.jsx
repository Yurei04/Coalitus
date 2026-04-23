"use client";

import { GripVertical, ToggleLeft, ToggleRight } from "lucide-react";
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
  const scores     = results?.[model.id];
  const top        = topEmotion(scores);
  const isDragging = dragging === model.id;
  const isOver     = dragOver === model.id && !isDragging;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, model.id)}
      onDragOver={(e)  => { e.preventDefault(); onDragOver(e, model.id); }}
      onDrop={(e)      => onDrop(e, model.id)}
      onDragEnd={onDragEnd}
      className="rounded-xl mb-2 select-none"
      style={{
        background: isOver ? `${model.color}0a` : "rgba(255,255,255,0.025)",
        border: `1px solid ${isOver ? model.color + "40" : isDragging ? model.color + "50" : "rgba(255,255,255,0.07)"}`,
        opacity: isDragging ? 0.45 : 1,
        cursor: "grab",
        transition: "border-color 0.15s, opacity 0.15s",
      }}
    >
      {/* ── header row ── */}
      <div className="flex items-center justify-between px-3.5 pt-3.5 pb-3">
        <div className="flex items-center gap-2.5">
          {/* grip */}
          <GripVertical
            size={14}
            strokeWidth={1.5}
            style={{ color: "rgba(255,255,255,0.18)", flexShrink: 0 }}
          />

          {/* status dot */}
          <div
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{
              background: enabled ? model.color : "rgba(255,255,255,0.12)",
              boxShadow: enabled ? `0 0 6px ${model.color}` : "none",
            }}
          />

          {/* name + badge */}
          <div className="flex flex-col">
            <span
              className="text-[13px] font-semibold leading-tight"
              style={{ color: enabled ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.35)" }}
            >
              {model.name}
            </span>
            <span
              className="text-[9px] tracking-widest"
              style={{
                fontFamily: "'Space Mono', monospace",
                color: enabled ? model.color : "rgba(255,255,255,0.18)",
              }}
            >
              {model.badge}
            </span>
          </div>
        </div>

        {/* toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(model.id); }}
          className="flex items-center shrink-0 transition-colors duration-150"
          style={{ color: enabled ? model.color : "rgba(255,255,255,0.2)", cursor: "pointer" }}
        >
          {enabled
            ? <ToggleRight size={22} strokeWidth={1.5} />
            : <ToggleLeft  size={22} strokeWidth={1.5} />
          }
        </button>
      </div>

      {/* ── results ── */}
      {enabled && (
        <div
          className="px-3.5 pb-3.5"
          style={{ borderTop: `1px solid ${model.color}14` }}
        >
          {scores ? (
            <>
              <div className="pt-3">
                {Object.entries(scores)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 4)
                  .map(([label, score]) => (
                    <EmotionBar key={label} label={label} score={score} color={model.color} />
                  ))}
              </div>

              {top && (
                <div
                  className="mt-2 px-3 py-2 rounded-lg flex items-center justify-between"
                  style={{
                    background: `${model.color}0a`,
                    border: `1px solid ${model.color}18`,
                  }}
                >
                  <span
                    className="text-[9px] uppercase tracking-[0.16em]"
                    style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.25)" }}
                  >
                    dominant
                  </span>
                  <span
                    className="text-[11px] font-bold capitalize"
                    style={{ fontFamily: "'Space Mono', monospace", color: model.color }}
                  >
                    {top[0]} · {fmt(top[1])}
                  </span>
                </div>
              )}
            </>
          ) : (
            <p
              className="text-center py-3 text-[11px]"
              style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.18)" }}
            >
              awaiting input…
            </p>
          )}
        </div>
      )}

      {!enabled && (
        <div className="px-3.5 pb-3">
          <p
            className="text-[11px] text-center"
            style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.14)" }}
          >
            disabled
          </p>
        </div>
      )}
    </div>
  );
}