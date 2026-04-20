import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { NAV_ITEMS } from "@/lib/constants"; 

export function LeftSidebar({ open, onToggle, activeTab, onTabChange, orderedModels, enabledModels }) {
  return (
    <aside
      className="relative flex flex-col border-r border-zinc-800/50 transition-all duration-300 ease-in-out shrink-0"
      style={{
        width: open ? 220 : 56,
        background: "rgba(10,10,12,0.95)",
      }}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-zinc-800/50 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "rgba(74,222,128,0.15)",
              border: "1px solid rgba(74,222,128,0.3)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <polygon
                points="12,2 22,20 2,20"
                stroke="#4ade80"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="12" cy="14" r="2" fill="#4ade80" />
            </svg>
          </div>
          {open && (
            <span className="text-sm font-semibold text-zinc-200 whitespace-nowrap overflow-hidden">
              EmoChat
            </span>
          )}
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.id;
          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                    active
                      ? "text-[#4ade80] bg-[#4ade80]/10"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                  )}
                  style={
                    active
                      ? { boxShadow: "inset 0 0 0 1px rgba(74,222,128,0.2)" }
                      : {}
                  }
                >
                  <span className="shrink-0">{item.icon}</span>
                  {open && (
                    <span className="whitespace-nowrap overflow-hidden">
                      {item.label}
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              {!open && (
                <TooltipContent side="right">{item.label}</TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </nav>

      {/* Active model dots */}
      {open && (
        <div className="px-4 py-3 border-t border-zinc-800/50">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">
            Active models
          </p>
          <div className="flex gap-1 flex-wrap">
            {orderedModels
              .filter((m) => enabledModels.has(m.id))
              .map((m) => (
                <div
                  key={m.id}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: m.color,
                    boxShadow: `0 0 4px ${m.color}`,
                  }}
                />
              ))}
          </div>
        </div>
      )}

      {/* Collapse button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors z-10"
        style={{
          background: "#18181b",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {open ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>
    </aside>
  );
}
