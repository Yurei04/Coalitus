import { Button } from "@/components/ui/button";

export function ChatInput({ value, onChange, onKeyDown, onSend, isLoading }) {
  const disabled = isLoading || !value.trim();

  return (
    <div
      className="px-5 py-4 border-t border-zinc-800/50 shrink-0"
      style={{ background: "rgba(10,10,12,0.9)" }}
    >
      <div className="max-w-3xl mx-auto flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder="Send a message…"
            rows={1}
            className="w-full resize-none outline-none text-sm text-zinc-200 placeholder:text-zinc-700 rounded-2xl px-4 py-3 leading-relaxed transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              maxHeight: 140,
              overflowY: "auto",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(74,222,128,0.35)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.1)")
            }
          />
        </div>

        <Button
          onClick={onSend}
          disabled={disabled}
          className="rounded-xl px-5 py-3 h-auto text-sm font-medium shrink-0 transition-all duration-150"
          style={{
            background: disabled
              ? "rgba(255,255,255,0.04)"
              : "rgba(74,222,128,0.15)",
            border: `1px solid ${
              disabled ? "rgba(255,255,255,0.08)" : "rgba(74,222,128,0.4)"
            }`,
            color: disabled ? "#52525b" : "#4ade80",
            boxShadow: !disabled ? "0 0 16px rgba(74,222,128,0.15)" : "none",
          }}
        >
          Send
        </Button>
      </div>

      <p className="text-[10px] text-zinc-700 mt-2 text-center">
        Shift+Enter for newline
      </p>
    </div>
  );
}
