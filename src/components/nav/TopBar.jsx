import { Separator } from "@/components/ui/separator";
import { MODELS } from "@/lib/constants";

export function TopBar({ activeTab, enabledModels }) {
  return (
    <div
      className="h-14 flex items-center px-5 border-b border-zinc-800/50 gap-3 shrink-0"
      style={{ background: "rgba(10,10,12,0.8)" }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"
          style={{ boxShadow: "0 0 6px #4ade80" }}
        />
        <span className="text-xs text-zinc-500 capitalize tracking-wide font-medium">
          {activeTab}
        </span>
      </div>

      <Separator orientation="vertical" className="h-4 bg-zinc-800" />

      <span className="text-xs text-zinc-600">
        {enabledModels.size} of {MODELS.length} models active
      </span>
    </div>
  );
}
