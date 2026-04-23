"use client";

import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatMessage({ msg }) {
  const isUser = msg.role === "user";
  const ts = msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp);

  return (
    <div className={cn("flex gap-3 mb-4", isUser ? "justify-end" : "justify-start")}>

      {/* AI avatar */}
      {!isUser && (
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{
            background: "rgba(57,255,142,0.08)",
            border: "1px solid rgba(57,255,142,0.22)",
          }}
        >
          <Bot size={13} style={{ color: "#39ff8e" }} strokeWidth={1.8} />
        </div>
      )}

      {/* bubble */}
      <div className={cn("max-w-[72%] flex flex-col", isUser ? "items-end" : "items-start")}>
        <div
          className="px-4 py-2.5 text-sm leading-relaxed"
          style={{
            background: isUser
              ? "rgba(57,255,142,0.08)"
              : "rgba(255,255,255,0.04)",
            border: isUser
              ? "1px solid rgba(57,255,142,0.22)"
              : "1px solid rgba(255,255,255,0.07)",
            borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            color: isUser ? "#d1fae5" : "rgba(255,255,255,0.6)",
          }}
        >
          {msg.content}
        </div>
        <span
          className="text-[10px] mt-1 px-1"
          style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.15)" }}
        >
          {ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {/* User avatar */}
      {isUser && (
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{
            background: "rgba(57,255,142,0.08)",
            border: "1px solid rgba(57,255,142,0.22)",
          }}
        >
          <User size={13} style={{ color: "#39ff8e" }} strokeWidth={1.8} />
        </div>
      )}
    </div>
  );
}