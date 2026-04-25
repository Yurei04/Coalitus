/**
 * lib/helpers.js
 *
 * Pure client-side utilities only.
 * All Gradio / HF Space calls have moved to /api/chat (route.js).
 */

/* ─────────────────────────────────────────────────────────
   Shared utilities
───────────────────────────────────────────────────────── */

export function buildConsensus(modelResults, enabledModels) {
  const active = Object.entries(modelResults).filter(([id]) =>
    enabledModels.has(id)
  );
  if (active.length === 0) return null;

  const totals = {};
  const counts = {};

  for (const [, scores] of active) {
    for (const [label, score] of Object.entries(scores)) {
      totals[label] = (totals[label] ?? 0) + score;
      counts[label] = (counts[label] ?? 0) + 1;
    }
  }

  return Object.fromEntries(
    Object.entries(totals).map(([l, t]) => [l, t / counts[l]])
  );
}

export function fmt(score) {
  return `${Math.round(score * 100)}%`;
}

export function topEmotion(scores) {
  if (!scores) return null;
  const entries = Object.entries(scores);
  if (entries.length === 0) return null;
  return entries.reduce((best, cur) => (cur[1] > best[1] ? cur : best));
}