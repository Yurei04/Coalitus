/**
 * lib/constants.js
 */

export const MODELS = [
  {
    id: "emotion",
    name: "Emotion Classifier",
    badge: "6-class",
    color: "#39ff8e",
    glow: "rgba(57,255,142,0.15)",
    spaceUrl: process.env.NEXT_PUBLIC_EMOTION_SPACE_URL || "",
    hfUrl: "https://huggingface.co/spaces/YureiYuri/emotionSpace",
    labels: ["sadness", "anger", "love", "surprise", "joy", "fear"],
  },
  {
    id: "topic",
    name: "Empathy",
    badge: "11-class",
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.15)",
    spaceUrl: process.env.NEXT_PUBLIC_TOPIC_SPACE_URL || "",
    hfUrl: "https://huggingface.co/spaces/YureiYuri/Empath",
    labels: [
      "anxiety",
      "depression",
      "grief",
      "trauma",
      "relationship",
      "family",
      "anger",
      "self_esteem",
      "sleep_issues",
      "general_support",
      "suicide",
    ],
  },
  {
    id: "distortion",
    name: "Emphasist",
    badge: "multi-label",
    color: "#a3e635",
    glow: "rgba(163,230,53,0.15)",
    spaceUrl: process.env.NEXT_PUBLIC_DISTORTION_SPACE_URL || "",
    hfUrl: "https://huggingface.co/spaces/YureiYuri/Emphasist",
    labels: [
      "overgeneralization",
      "catastrophizing",
      "black_and_white",
      "self_blame",
      "mind_reading",
    ],
  },
  {
    id: "stress",
    name: "Stress Predictor",
    badge: "3-class",
    color: "#fb923c",
    glow: "rgba(251,146,60,0.15)",
    spaceUrl: process.env.NEXT_PUBLIC_STRESS_SPACE_URL || "",
    hfUrl: "https://huggingface.co/spaces/YureiYuri/stressUpSpace",
    labels: ["low", "medium", "high"],
  },
];

// MY_MODELS = same list with extra display metadata
export const MY_MODELS = [
  {
    ...MODELS[0],
    emoji: "🎭",
    architecture: "DistilBERT fine-tuned",
    description:
      "Classifies text into 6 core emotions. Fine-tuned on a labelled emotion dataset. Powers real-time emotion detection on every chat message.",
    useCase:
      "Real-time emotion tracking across every conversation turn.",
  },
  {
    ...MODELS[1],
    emoji: "💙",
    architecture: "DistilBERT fine-tuned",
    description:
      "Routes mental health messages into 11 topic categories. Trained on 3,508 real counselling conversations. Powers the Triage tool.",
    useCase:
      "Triage routing, counselor pre-reads, session topic tracking.",
  },
  {
    ...MODELS[2],
    emoji: "🧠",
    architecture: "RoBERTa fine-tuned",
    description:
      "Multi-label classifier that detects cognitive distortions from CBT. Helps counselors spot unhealthy thinking patterns before a session begins.",
    useCase:
      "Pre-session distortion screening, CBT session planning.",
  },
  {
    ...MODELS[3],
    emoji: "📚",
    architecture: "Tabular classifier",
    description:
      "Predicts student stress level from 20 psychosocial inputs including sleep quality, peer pressure, and academic load.",
    useCase:
      "Student wellness screening, academic stress monitoring.",
  },
];

// ── Nav ── "Usage" groups chat/analysis/triage. Home links back to landing. Settings removed.
export const NAV_ITEMS = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <polyline points="9 21 9 12 15 12 15 21" />
      </svg>
    ),
  },
  {
    id: "usage",
    label: "Usage",
    isGroup: true,
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 8 12 12 14 14" />
      </svg>
    ),
    children: [
      {
        id: "chat",
        label: "Chat",
        icon: (
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        ),
      },
      {
        id: "analysis",
        label: "Analysis",
        icon: (
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        ),
      },
      {
        id: "triage",
        label: "Triage",
        icon: (
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        ),
      },
    ],
  },
  {
    id: "models",
    label: "Our Models",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="3" width="7" height="7" rx="1" />
        <rect x="15" y="3" width="7" height="7" rx="1" />
        <rect x="2" y="14" width="7" height="7" rx="1" />
        <rect x="15" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "history",
    label: "History",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];