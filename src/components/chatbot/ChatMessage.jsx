import { cn } from "@/lib/utils";

export function ChatMessage({ msg }) {
  const isUser = msg.role === "user";
  const ts =
    msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp);

  return (
    <div className={cn("flex gap-3 mb-5", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5"
          style={{
            background: "rgba(74,222,128,0.1)",
            border: "1px solid rgba(74,222,128,0.25)",
            color: "#4ade80",
          }}
        >
          AI
        </div>
      )}

      <div className={cn("max-w-[70%] flex flex-col", isUser ? "items-end" : "items-start")}>
        <div
          className="px-4 py-2.5 text-sm leading-relaxed"
          style={{
            background: isUser
              ? "linear-gradient(135deg, rgba(74,222,128,0.15), rgba(74,222,128,0.08))"
              : "rgba(255,255,255,0.05)",
            border: isUser
              ? "1px solid rgba(74,222,128,0.25)"
              : "1px solid rgba(255,255,255,0.07)",
            borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            color: isUser ? "#d1fae5" : "#a1a1aa",
          }}
        >
          {msg.content}
        </div>
        <span className="text-[10px] text-zinc-700 mt-1 px-1">
          {ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5"
          style={{
            background: "rgba(74,222,128,0.1)",
            border: "1px solid rgba(74,222,128,0.25)",
            color: "#4ade80",
          }}
        >
          You
        </div>
      )}
    </div>
  );
}
