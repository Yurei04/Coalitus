"use client";

import { fmt } from "@/lib/helpers";

export function EmotionBar({ label, score, color }) {
  return (
    <div className="mb-2.5">
      <div className="flex justify-between items-center mb-1.5">
        <span
          className="text-[11px] capitalize tracking-wide"
          style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.38)" }}
        >
          {label.replace(/_/g, " ")}
        </span>
        <span
          className="text-[11px] font-bold"
          style={{ fontFamily: "'Space Mono', monospace", color }}
        >
          {fmt(score)}
        </span>
      </div>

      {/* track */}
      <div
        className="h-0.5 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: fmt(score),
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 6px ${color}50`,
          }}
        />
      </div>
    </div>
  );
}