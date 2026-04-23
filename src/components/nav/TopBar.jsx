import { MODELS } from "@/lib/constants";

export function TopBar({ activeTab, enabledModels }) {
  const TAB_COLORS = {
    chat:     { color: "#4ade80", shadow: "rgba(74,222,128,0.5)" },
    analysis: { color: "#22d3ee", shadow: "rgba(34,211,238,0.5)" },
    triage:   { color: "#a78bfa", shadow: "rgba(167,139,250,0.5)" },
    models:   { color: "#f472b6", shadow: "rgba(244,114,182,0.5)" },
    history:  { color: "#fbbf24", shadow: "rgba(251,191,36,0.5)" },
    settings: { color: "#94a3b8", shadow: "rgba(148,163,184,0.4)" },
  };
  const tc = TAB_COLORS[activeTab] ?? TAB_COLORS.chat;

  return (
    <div
      className="h-14 flex items-center px-5 gap-4 shrink-0 relative overflow-hidden"
      style={{
        background: "rgba(18,20,26,0.98)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Dotted background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Prismatic top gradient bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: "linear-gradient(90deg, #4ade80 0%, #22d3ee 25%, #a78bfa 50%, #f472b6 75%, #fbbf24 100%)",
          opacity: 0.85,
        }}
      />

      {/* Ambient glow behind active tab color */}
      <div
        className="absolute top-0 left-0 right-0 h-10 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 300px 40px at 120px 0, ${tc.shadow.replace("0.5", "0.07")}, transparent)`,
        }}
      />

      {/* Tab indicator */}
      <div className="flex items-center gap-2.5 relative z-10">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: tc.color, boxShadow: `0 0 8px ${tc.color}, 0 0 20px ${tc.shadow}` }}
        />
        <span
          className="text-xs capitalize tracking-widest font-bold"
          style={{ color: tc.color, textShadow: `0 0 14px ${tc.shadow}`, letterSpacing: "0.12em" }}
        >
          {activeTab}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 shrink-0 relative z-10" style={{ background: "rgba(255,255,255,0.1)" }} />

      {/* Models active pill */}
      <div
        className="flex items-center gap-2 px-3 py-1 rounded-full relative z-10"
        style={{
          background: "rgba(34,211,238,0.08)",
          border: "1px solid rgba(34,211,238,0.2)",
        }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "#22d3ee", boxShadow: "0 0 6px #22d3ee" }}
        />
        <span className="text-[11px] font-semibold tracking-wide" style={{ color: "#22d3ee" }}>
          {enabledModels.size}/{MODELS.length} active
        </span>
      </div>

      {/* Right side: rainbow dot row */}
      <div className="ml-auto flex items-center gap-1.5 relative z-10">
        {["#4ade80", "#22d3ee", "#a78bfa", "#f472b6", "#fbbf24"].map((c, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: c, opacity: 0.5 + i * 0.1, boxShadow: `0 0 4px ${c}` }}
          />
        ))}
      </div>
    </div>
  );
}