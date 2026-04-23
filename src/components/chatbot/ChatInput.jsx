"use client";

import { SendHorizonal, Loader2 } from "lucide-react";

export function ChatInput({ value, onChange, onKeyDown, onSend, isLoading }) {
  const disabled = isLoading || !value.trim();

  return (
    <div
      className="shrink-0 px-5 py-4"
      style={{
        background: "rgba(0,9,29,0.97)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-3xl mx-auto flex gap-3 items-end">

        {/* textarea */}
        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder="Send a message…"
            rows={1}
            className="w-full resize-none outline-none text-sm leading-relaxed rounded-xl px-4 py-3 transition-colors duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.75)",
              caretColor: "#39ff8e",
              maxHeight: 140,
              overflowY: "auto",
              fontFamily: "inherit",
            }}
            onFocus={e  => (e.target.style.borderColor = "rgba(57,255,142,0.3)")}
            onBlur={e   => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
          />
        </div>

        {/* send button */}
        <button
          onClick={onSend}
          disabled={disabled}
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150"
          style={{
            background: disabled ? "rgba(255,255,255,0.04)" : "rgba(57,255,142,0.12)",
            border: `1px solid ${disabled ? "rgba(255,255,255,0.07)" : "rgba(57,255,142,0.35)"}`,
            color: disabled ? "rgba(255,255,255,0.18)" : "#39ff8e",
            boxShadow: !disabled ? "0 0 14px rgba(57,255,142,0.14)" : "none",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {isLoading
            ? <Loader2 size={15} className="animate-spin" />
            : <SendHorizonal size={15} strokeWidth={1.8} />
          }
        </button>
      </div>

      <p
        className="text-center mt-2 text-[10px]"
        style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.12)" }}
      >
        Enter to send · Shift+Enter for newline
      </p>
    </div>
  );
}