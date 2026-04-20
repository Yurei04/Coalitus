import { ScrollArea } from "@/components/ui/scroll-area";
import { EmotionBar } from "./EmotionBar";

export function AnalysisView({ modelResults, orderedModels, enabledModels }) {
  const enabledList = orderedModels.filter((m) => enabledModels.has(m.id));

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="p-6">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-5">
          Emotion Analysis
        </h2>

        {enabledList.length === 0 ? (
          <p className="text-sm text-zinc-600 mt-16 text-center">
            Enable models in the right panel
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {enabledList.map((model) => {
              const scores = modelResults[model.id];
              return (
                <div
                  key={model.id}
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${model.color}25`,
                  }}
                >
                  <p
                    className="text-xs font-semibold mb-3"
                    style={{ color: model.color }}
                  >
                    {model.name}
                  </p>
                  {scores ? (
                    Object.entries(scores)
                      .sort((a, b) => b[1] - a[1])
                      .map(([label, score]) => (
                        <EmotionBar
                          key={label}
                          label={label}
                          score={score}
                          color={model.color}
                        />
                      ))
                  ) : (
                    <p className="text-xs text-zinc-600">
                      No data — start chatting
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
