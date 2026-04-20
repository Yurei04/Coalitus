import { ScrollArea } from "@/components/ui/scroll-area";

export function HistoryView({ messages }) {
  return (
    <ScrollArea className="flex-1 h-full">
      <div className="p-6">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-5">
          Conversation History
        </h2>

        {messages.length === 0 ? (
          <p className="text-sm text-zinc-600">No messages yet.</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className="py-3 border-b border-zinc-800/60 last:border-0"
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: m.role === "user" ? "#4ade80" : "#71717a" }}
                >
                  {m.role === "user" ? "You" : "AI"}
                </span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                {m.content}
              </p>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
}
