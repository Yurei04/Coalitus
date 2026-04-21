// 👉 Replace with your actual HF API Space name once deployed
export const API_SPACE_URL = "https://yureiyuri-mental-health-nlp-api.hf.space";

export const MODELS = [
  {
    id: "hartmann",
    name: "DistilRoBERTa",
    hfId: "j-hartmann/emotion-english-distilroberta-base",
    color: "#4ade80",
    glow: "#4ade8040",
    badge: "7-class",
    desc: "anger · disgust · fear · joy · neutral · sadness · surprise",
  },
  {
    id: "samlowe",
    name: "GoEmotions",
    hfId: "SamLowe/roberta-base-go_emotions",
    color: "#38bdf8",
    glow: "#38bdf840",
    badge: "28-class",
    desc: "Fine-grained taxonomy from Google research",
  },
  {
    id: "bhadresh",
    name: "DistilBERT",
    hfId: "bhadresh-savani/distilbert-base-uncased-emotion",
    color: "#e879f9",
    glow: "#e879f940",
    badge: "6-class",
    desc: "sadness · joy · love · anger · fear · surprise",
  },
  {
    id: "michelle",
    name: "EmoClassify",
    hfId: "michellejieli/emotion_text_classifier",
    color: "#fb923c",
    glow: "#fb923c40",
    badge: "6-class",
    desc: "Sentiment-aware 6-label emotion classifier",
  },
];

export const MY_MODELS = [
  {
    id: "emotion",
    name: "Emotion Classifier",
    emoji: "💬",
    color: "#4ade80",
    glow: "#4ade8040",
    badge: "6-class",
    architecture: "DistilBERT fine-tuned",
    labels: ["sadness", "anger", "love", "surprise", "fear", "joy"],
    description:
      "Classifies text into 6 core emotions. Fine-tuned on DistilBERT using a labelled emotion dataset. Powers real-time emotion detection on every message in this chatbot.",
    useCase: "Emotion detection · sentiment routing · chatbot tone awareness",
    hfUrl: "https://huggingface.co/spaces/YureiYuri/emotionSpace",
  },
  {
    id: "topic",
    name: "Mental Health Topic Router",
    emoji: "💙",
    color: "#38bdf8",
    glow: "#38bdf840",
    badge: "11-class",
    architecture: "DistilBERT fine-tuned",
    labels: ["anxiety", "depression", "grief", "trauma", "relationship", "family", "self_esteem", "sleep_issues", "anger", "suicide", "general_support"],
    description:
      "Routes mental health messages into 11 topic categories. Trained on 3,508 real counselling conversations. Powers the Triage tool to identify what kind of support a user needs.",
    useCase: "Counseling triage · support forum routing · chatbot specialization",
    hfUrl: "https://huggingface.co/spaces/YureiYuri/Empath",
  },
  {
    id: "distortion",
    name: "CBT Distortion Detector",
    emoji: "🧠",
    color: "#e879f9",
    glow: "#e879f940",
    badge: "5-class · multi-label",
    architecture: "DistilBERT (YureiYuri/empathist)",
    labels: ["overgeneralization", "catastrophizing", "black_and_white", "self_blame", "mind_reading"],
    description:
      "Multi-label classifier that detects cognitive distortions from Cognitive Behavioral Therapy (CBT). Helps counselors spot unhealthy thinking patterns before a session begins.",
    useCase: "CBT journaling · therapist pre-reads · distortion awareness tools",
    hfUrl: "https://huggingface.co/spaces/YureiYuri/Emphasist",
  },
  {
    id: "stress",
    name: "Student Stress Predictor",
    emoji: "🎓",
    color: "#fb923c",
    glow: "#fb923c40",
    badge: "3-class",
    architecture: "PyTorch Feedforward NN (256→128→64)",
    labels: ["low", "medium", "high"],
    description:
      "Predicts student stress level from 20 psychosocial inputs including sleep quality, peer pressure, academic load, and anxiety. Trained on student wellness survey data.",
    useCase: "School counseling · student wellness dashboards · early intervention",
    hfUrl: "https://huggingface.co/spaces/YureiYuri/stressUpSpace",
  },
];

// ── Nav — "Usage" groups chat/analysis/triage into a collapsible dropdown ──
export const NAV_ITEMS = [
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
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];