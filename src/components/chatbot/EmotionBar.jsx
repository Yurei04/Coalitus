import { fmt } from "@/lib/helpers"; 

export function EmotionBar({ label, score, color }) {
  return (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <span className="text-[11px] text-zinc-500 capitalize tracking-wide">
          {label}
        </span>
        <span className="text-[11px] font-medium" style={{ color }}>
          {fmt(score)}
        </span>
      </div>
      <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: fmt(score),
            background: color,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
    </div>
  );
}
