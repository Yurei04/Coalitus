"use client";

import { Brain, HeartPulse, BookOpen, GraduationCap, Wifi, WifiOff } from "lucide-react";
import { EmotionBar } from "./EmotionBar";
import { fmt, topEmotion } from "@/lib/helpers";

const MODEL_ICONS = {
  emotion:    HeartPulse,
  topic:      Brain,
  distortion: BookOpen,
  stress:     GraduationCap,
};

function ModelPanel({ model, scores, enabled }) {
  const Icon = MODEL_ICONS[model.id] ?? Brain;
  const top  = topEmotion(scores);
  const hasData = scores && Object.keys(scores).length > 0;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: enabled ? `${model.color}06` : "rgba(255,255,255,0.02)",
        border:     `1px solid ${enabled ? model.color + "22" : "rgba(255,255,255,0.06)"}`,
        opacity:    enabled ? 1 : 0.45,
      }}
    >
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom:`1px solid ${model.color}14` }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background:`${model.color}12`, border:`1px solid ${model.color}25` }}>
            <Icon size={15} style={{ color: model.color }} strokeWidth={1.8} />
          </div>
          <div>
            <div className="text-[13px] font-bold" style={{ fontFamily:"'Syne',sans-serif", color:"rgba(255,255,255,0.82)" }}>
              {model.name}
            </div>
            <div className="text-[9px] tracking-widest mt-0.5"
              style={{ fontFamily:"'Space Mono',monospace", color: model.color }}>
              {model.badge}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {enabled
            ? <Wifi size={12} style={{ color:"rgba(57,255,142,0.5)" }} />
            : <WifiOff size={12} style={{ color:"rgba(255,255,255,0.18)" }} />
          }
        </div>
      </div>

      {/* body */}
      <div className="px-4 py-4">
        {!enabled ? (
          <p className="text-[11px] text-center py-2"
            style={{ fontFamily:"'Space Mono',monospace", color:"rgba(255,255,255,0.15)" }}>
            model disabled
          </p>
        ) : !hasData ? (
          <p className="text-[11px] text-center py-2"
            style={{ fontFamily:"'Space Mono',monospace", color:"rgba(255,255,255,0.2)" }}>
            awaiting message…
          </p>
        ) : (
          <>
            {Object.entries(scores)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([label, score]) => (
                <EmotionBar key={label} label={label} score={score} color={model.color} />
              ))}

            {top && (
              <div className="mt-3 px-3 py-2 rounded-lg flex items-center justify-between"
                style={{ background:`${model.color}0a`, border:`1px solid ${model.color}18` }}>
                <span className="text-[9px] uppercase tracking-[0.16em]"
                  style={{ fontFamily:"'Space Mono',monospace", color:"rgba(255,255,255,0.25)" }}>
                  dominant
                </span>
                <span className="text-[11px] font-bold capitalize"
                  style={{ fontFamily:"'Space Mono',monospace", color: model.color }}>
                  {top[0].replace(/_/g," ")} · {fmt(top[1])}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function AnalysisView({ modelResults, orderedModels, enabledModels }) {
  const hasAnyData = Object.values(modelResults).some(s => Object.keys(s).length > 0);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');`}</style>

      <div className="flex-1 overflow-y-auto p-6" style={{ background:"rgba(0,9,29,0.98)" }}>
        <div className="max-w-5xl mx-auto">

          {/* heading */}
          <div className="mb-6">
            <h2 className="text-xl font-extrabold mb-1"
              style={{
                fontFamily:"'Syne',sans-serif",
                background:"linear-gradient(135deg,#d1fae5,#86efac)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              }}>
              Model Analysis
            </h2>
            <p className="text-sm"
              style={{ fontFamily:"'Space Mono',monospace", color:"rgba(255,255,255,0.25)" }}>
              {hasAnyData
                ? "Live breakdown across all enabled models."
                : "Send a message in Chat to see real-time model results here."}
            </p>
          </div>

          {/* 2×2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orderedModels.map(model => (
              <ModelPanel
                key={model.id}
                model={model}
                scores={modelResults[model.id]}
                enabled={enabledModels.has(model.id)}
              />
            ))}
          </div>

          {/* empty state */}
          {!hasAnyData && (
            <div className="mt-10 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background:"rgba(57,255,142,0.06)", border:"1px solid rgba(57,255,142,0.14)" }}>
                <Brain size={28} style={{ color:"rgba(57,255,142,0.4)" }} strokeWidth={1.4} />
              </div>
              <p className="text-sm" style={{ fontFamily:"'Space Mono',monospace", color:"rgba(255,255,255,0.2)" }}>
                No analysis yet — start chatting to see results
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}