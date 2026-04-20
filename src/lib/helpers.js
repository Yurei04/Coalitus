export function fmt(n) {
  return (n * 100).toFixed(1) + "%";
}

export function topEmotion(scores) {
  if (!scores) return null;
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
}

export function mockAnalyze(text) {
  const lower = text.toLowerCase();
  const base = {
    anger: 0.04,
    disgust: 0.03,
    fear: 0.04,
    joy: 0.06,
    neutral: 0.75,
    sadness: 0.05,
    surprise: 0.03,
  };
  if (/happy|great|awesome|love|wonderful|amazing|excited|glad/.test(lower))
    return { ...base, joy: 0.82, neutral: 0.1 };
  if (/sad|sorry|miss|lonely|cry|depressed|hurt/.test(lower))
    return { ...base, sadness: 0.76, neutral: 0.12 };
  if (/angry|hate|furious|annoyed|rage|mad/.test(lower))
    return { ...base, anger: 0.79, neutral: 0.1 };
  if (/scared|afraid|worried|anxious|nervous|terrified/.test(lower))
    return { ...base, fear: 0.73, neutral: 0.14 };
  if (/wow|really|surprising|unexpected|shocked/.test(lower))
    return { ...base, surprise: 0.68, neutral: 0.2 };
  return base;
}

export async function callHuggingFace(text, hfId) {
  try {
    const res = await fetch(
      `https://api-inference.huggingface.co/models/${hfId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: text }),
      }
    );
    if (!res.ok) throw new Error("hf error");
    const data = await res.json();
    const raw = Array.isArray(data[0]) ? data[0] : data;
    if (!Array.isArray(raw) || !raw[0]?.label) throw new Error("bad shape");
    return Object.fromEntries(
      [...raw]
        .sort((a, b) => b.score - a.score)
        .slice(0, 7)
        .map((x) => [x.label.toLowerCase(), x.score])
    );
  } catch {
    return mockAnalyze(text);
  }
}

export function buildConsensus(modelResults, enabledModels) {
  const all = {};
  Object.entries(modelResults).forEach(([mid, scores]) => {
    if (!enabledModels.has(mid) || !scores) return;
    Object.entries(scores).forEach(([label, score]) => {
      all[label] = (all[label] || 0) + score;
    });
  });
  const count = Object.keys(modelResults).filter((id) =>
    enabledModels.has(id)
  ).length;
  if (!count) return null;
  return Object.fromEntries(
    Object.entries(all).map(([k, v]) => [k, v / count])
  );
}
