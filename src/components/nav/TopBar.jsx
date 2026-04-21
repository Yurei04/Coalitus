import { Separator } from "@/components/ui/separator";
import { MODELS } from "@/lib/constants";

export function TopBar({ activeTab, enabledModels }) {
  return (
    <div
      className="h-14 flex items-center px-5 gap-3 shrink-0 relative"
      style={{
        background: "rgba(28,30,34,0.97)",
        borderBottom: "1px solid rgba(74,222,128,0.15)",
        boxShadow: "0 1px 0 rgba(74,222,128,0.08)",
      }}
    >
      {/* Neon green top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent, #4ade80 40%, #4ade80 60%, transparent)" }}
      />

      <div className="flex items-center gap-2.5">
        <div
          className="w-2 h-2 rounded-full bg-[#4ade80]"
          style={{ boxShadow: "0 0 8px #4ade80, 0 0 16px rgba(74,222,128,0.4)" }}
        />
        <span
          className="text-xs capitalize tracking-wide font-semibold"
          style={{ color: "#4ade80", textShadow: "0 0 12px rgba(74,222,128,0.5)" }}
        >
          {activeTab}
        </span>
      </div>

      <Separator orientation="vertical" className="h-4" style={{ background: "rgba(74,222,128,0.2)" }} />

      <span className="text-xs font-medium" style={{ color: "rgba(74,222,128,0.6)" }}>
        {enabledModels.size} of {MODELS.length} models active
      </span>
    </div>
  );
}