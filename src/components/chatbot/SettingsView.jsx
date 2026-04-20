import { ScrollArea } from "@/components/ui/scroll-area";

const FIELDS = [
  {
    label: "HuggingFace API Token",
    placeholder: "hf_xxxxxxxxxxxx",
    hint: "Optional — increases rate limits",
  },
  {
    label: "Groq API Key",
    placeholder: "gsk_xxxxxxxxxxxx",
    hint: "Set GROQ_API_KEY in .env.local",
  },
  {
    label: "Analysis debounce (ms)",
    placeholder: "500",
    hint: "Delay before running emotion analysis",
  },
];

export function SettingsView() {
  return (
    <ScrollArea className="flex-1 h-full">
      <div className="p-6 space-y-6">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
          Configuration
        </h2>

        {FIELDS.map((field) => (
          <div key={field.label} className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">
              {field.label}
            </label>
            <input
              placeholder={field.placeholder}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-300 placeholder:text-zinc-700 outline-none focus:border-green-500/40 transition-colors"
            />
            <p className="text-[11px] text-zinc-600">{field.hint}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
