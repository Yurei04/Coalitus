# EmoChat 🌿

> An emotion-aware mental health chatbot that analyses every conversation in real time using 4 public NLP models and 4 custom-trained models — live on Hugging Face Spaces.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![HF Spaces](https://img.shields.io/badge/Hugging%20Face-Spaces-orange?style=flat-square&logo=huggingface)

---

## What It Does

EmoChat is a mental health support chatbot that runs multiple NLP models simultaneously on every message. It detects emotion, routes to support topics, identifies cognitive distortions, and flags crisis content in real time — while giving counselors an instant pre-read before a session begins.

---

## Features

### 💬 Chat
Conversational interface powered by a backend LLM. Every message sent and received is automatically run through all active emotion models in parallel.

### 📊 Analysis
Live breakdown of emotion scores across all active models with a consensus view. Models can be toggled on/off and reordered by drag-and-drop.

### 🏥 Triage
Counseling pre-read tool. Paste any client message and instantly get:
- **Priority level** — Low → Critical, with auto-escalation for crisis content
- **Emotion** — detected affect with confidence score
- **Topic** — which mental health category the message falls under
- **Distortions** — any CBT cognitive distortions present
- **Counselor pre-read** — plain-English summary for the specialist
- **Crisis resources** — 988 Lifeline and Crisis Text Line shown automatically when needed

### 🤖 Our Models
Showcase of all 4 custom-trained models with expandable cards showing architecture, output labels, use cases, JavaScript and Python code snippets, and links to each Hugging Face Space.

### 🕐 History
Full conversation log with timestamps.

---

## Models

### Public Emotion Models (real-time sidebar)

| Model | Labels | HF ID |
|---|---|---|
| DistilRoBERTa | 7-class | `j-hartmann/emotion-english-distilroberta-base` |
| GoEmotions | 28-class | `SamLowe/roberta-base-go_emotions` |
| DistilBERT | 6-class | `bhadresh-savani/distilbert-base-uncased-emotion` |
| EmoClassify | 6-class | `michellejieli/emotion_text_classifier` |

### Custom-Trained Models (API + Triage)

| Model | Task | Labels | Space |
|---|---|---|---|
| 💬 Emotion Classifier | 6-class · single-label | sadness, anger, love, surprise, fear, joy | [emotionSpace](https://huggingface.co/spaces/YureiYuri/emotionSpace) |
| 💙 Topic Router | 11-class · single-label | anxiety, depression, grief, trauma, relationship, family, self_esteem, sleep_issues, anger, suicide, general_support | [Empath](https://huggingface.co/spaces/YureiYuri/Empath) |
| 🧠 Distortion Detector | 5-class · multi-label | overgeneralization, catastrophizing, black_and_white, self_blame, mind_reading | [Emphasist](https://huggingface.co/spaces/YureiYuri/Emphasist) |
| 🎓 Stress Predictor | 3-class · single-label | low, medium, high | [stressUpSpace](https://huggingface.co/spaces/YureiYuri/stressUpSpace) |

All 4 custom models are served through a single unified FastAPI + Gradio Space.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Next.js Frontend                  │
│                                                     │
│  LeftSidebar     MainContent        RightSidebar    │
│  ───────────     ─────────────      ─────────────   │
│  Usage ▾         Chat               Model Cards     │
│   ├ Chat         Analysis           Consensus       │
│   ├ Analysis     Triage             Toggle / Drag   │
│   └ Triage       Our Models                         │
│  Our Models      History                            │
│  History         Settings                           │
│  Settings                                           │
└────────────────────────┬────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
   /api/chat (LLM)          HF Inference API
   Next.js route            (4 public models, parallel)
                                        
                         Mental Health NLP API
                         (HF Space · FastAPI · free)
                         
                         POST /analyze
                           → emotion · topic
                           → distortions · crisis flag
                         
                         POST /stress
                           → stress level (low/med/high)
                         
                         GET /docs  (Swagger UI)
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- An LLM API key (set in Settings or `.env.local`)

### Install & Run

```bash
git clone https://github.com/YureiYuri/emochat
cd emochat
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_SPACE_URL=https://yureiyuri-mental-health-nlp-api.hf.space
```

---

## API Usage

All 4 custom models are available as a free, keyless REST API. CORS is fully open — call it from any app, website, or chatbot.

### Analyze text — emotion + topic + distortions + crisis flag

```js
const res = await fetch("https://yureiyuri-mental-health-nlp-api.hf.space/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "I can't stop worrying about everything." }),
});
const { emotion, topic, distortion, crisis } = await res.json();
```

### Predict student stress level

```js
const res = await fetch("https://yureiyuri-mental-health-nlp-api.hf.space/stress", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ anxiety_level: 15, self_esteem: 10, /* 20 fields total */ }),
});
const { label, confidence } = await res.json();
// { label: "high", confidence: 0.86 }
```

Full interactive docs: [`/docs`](https://yureiyuri-mental-health-nlp-api.hf.space/docs)

---

## Project Structure

```
├── app/
│   ├── page.jsx                  # Main page — layout + all state
│   └── api/chat/route.js         # LLM backend route
├── components/
│   ├── chatbot/
│   │   ├── ChatView.jsx
│   │   ├── AnalysisView.jsx
│   │   ├── TriageView.jsx        # Counseling triage tool
│   │   ├── ModelsView.jsx        # Model showcase + code snippets
│   │   ├── HistoryView.jsx
│   │   └── SettingsView.jsx
│   └── nav/
│       ├── LeftSidebar.jsx       # Collapsible nav with Usage dropdown
│       ├── RightSidebar.jsx      # Live model results + drag/drop
│       └── TopBar.jsx
└── lib/
    ├── constants.js              # MODELS, MY_MODELS, NAV_ITEMS, API_SPACE_URL
    └── helpers.js                # callHuggingFace, buildConsensus
```

---

## Built For

This project was built as a hackathon submission to demonstrate how multiple NLP models can be composed into a real-world mental health support interface. All models are open and free to use.

---

## Disclaimer

EmoChat is an educational and research tool. It is **not** a substitute for professional mental health care. If you or someone you know is in crisis:

- **988 Suicide & Crisis Lifeline** — call or text **988** (US)  
- **Crisis Text Line** — text HOME to **741741** (US / UK / CA / IE)  
- **International** — [iasp.info/resources/Crisis_Centres](https://www.iasp.info/resources/Crisis_Centres/)

---

## License

MIT
