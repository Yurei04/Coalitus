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

export const NAV_ITEMS = [
  {
    id: "chat",
    label: "Chat",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "analysis",
    label: "Analysis",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
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
