"use client";

import { useEffect, useRef } from "react";
import { Bot, User, Loader2, SendHorizonal } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── single message bubble ── */
function ChatMessage({ msg }) {
  const isUser = msg.role === "user";
  const ts = msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp);

  return (
    <div className={cn("flex gap-3 mb-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ background:"rgba(57,255,142,0.08)", border:"1px solid rgba(57,255,142,0.22)" }}>
          <Bot size={13} style={{ color:"#39ff8e" }} strokeWidth={1.8} />
        </div>
      )}

      <div className={cn("max-w-[72%] flex flex-col", isUser ? "items-end" : "items-start")}>
        <div className="px-4 py-2.5 text-sm leading-relaxed" style={{
          background: isUser ? "rgba(57,255,142,0.08)" : "rgba(255,255,255,0.04)",
          border:     isUser ? "1px solid rgba(57,255,142,0.22)" : "1px solid rgba(255,255,255,0.07)",
          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          color: isUser ? "#d1fae5" : "rgba(255,255,255,0.6)",
        }}>
          {msg.content}
        </div>
        <span className="text-[10px] mt-1 px-1"
          style={{ fontFamily:"'Space Mono',monospace", color:"rgba(255,255,255,0.15)" }}>
          {ts.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}
        </span>
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ background:"rgba(57,255,142,0.08)", border:"1px solid rgba(57,255,142,0.22)" }}>
          <User size={13} style={{ color:"#39ff8e" }} strokeWidth={1.8} />
        </div>
      )}
    </div>
  );
}

/* ── typing indicator ── */
function TypingDots() {
  return (
    <div className="flex gap-3 mb-4 justify-start">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background:"rgba(57,255,142,0.08)", border:"1px solid rgba(57,255,142,0.22)" }}>
        <Bot size={13} style={{ color:"#39ff8e" }} strokeWidth={1.8} />
      </div>
      <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
        style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)" }}>
        {[0,1,2].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full" style={{
            background:"rgba(57,255,142,0.5)",
            animation:`typing-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

/* ── ChatView ── */
export function ChatView({ messages, isLoading, input, onInputChange, onKeyDown, onSend }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <>
      <style>{`
        @keyframes typing-bounce {
          0%,60%,100% { transform:translateY(0);    opacity:.4; }
          30%          { transform:translateY(-5px); opacity:1;  }
        }
      `}</style>

      {/* message list */}
      <div className="flex-1 overflow-y-auto px-5 py-5" style={{ scrollbarWidth:"thin", scrollbarColor:"rgba(255,255,255,0.06) transparent" }}>
        <div className="max-w-3xl mx-auto">
          {messages.map(msg => <ChatMessage key={msg.id} msg={msg} />)}
          {isLoading && <TypingDots />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* input bar */}
      <div className="shrink-0 px-5 py-4" style={{ background:"rgba(0,9,29,0.97)", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              placeholder="Send a message…"
              rows={1}
              className="w-full resize-none outline-none text-sm leading-relaxed rounded-xl px-4 py-3 transition-colors duration-200"
              style={{
                background:"rgba(255,255,255,0.04)",
                border:"1px solid rgba(255,255,255,0.08)",
                color:"rgba(255,255,255,0.75)",
                caretColor:"#39ff8e",
                maxHeight:140, overflowY:"auto",
                fontFamily:"inherit",
              }}
              onFocus={e  => (e.target.style.borderColor = "rgba(57,255,142,0.3)")}
              onBlur={e   => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>
          <button
            onClick={onSend}
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150"
            style={{
              background: isLoading || !input.trim() ? "rgba(255,255,255,0.04)" : "rgba(57,255,142,0.12)",
              border:     `1px solid ${isLoading || !input.trim() ? "rgba(255,255,255,0.07)" : "rgba(57,255,142,0.35)"}`,
              color:      isLoading || !input.trim() ? "rgba(255,255,255,0.18)" : "#39ff8e",
              cursor:     isLoading || !input.trim() ? "not-allowed" : "pointer",
            }}
          >
            {isLoading
              ? <Loader2 size={15} className="animate-spin" />
              : <SendHorizonal size={15} strokeWidth={1.8} />
            }
          </button>
        </div>
        <p className="text-center mt-2 text-[10px]"
          style={{ fontFamily:"'Space Mono',monospace", color:"rgba(255,255,255,0.12)" }}>
          Enter to send · Shift+Enter for newline
        </p>
      </div>
    </>
  );
}