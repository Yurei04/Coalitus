import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

export function ChatView({ messages, isLoading, input, onInputChange, onKeyDown, onSend }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <>
      <ScrollArea className="flex-1 h-full">
        <div className="px-6 py-5 max-w-3xl mx-auto w-full">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} msg={msg} />
          ))}

          {isLoading && <TypingIndicator />}

          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      <ChatInput
        value={input}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        onSend={onSend}
        isLoading={isLoading}
      />

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-5">
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
      <div
        className="px-4 py-3 rounded-[18px] rounded-bl-[4px] flex gap-1 items-center"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-zinc-500"
            style={{ animation: `bounce 1.2s ${i * 0.15}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
