# Coalitus Collective

> **Emotion AI Platform** — Real-time mental health NLP powered by an ensemble of 4 custom-trained models.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css)
![HuggingFace](https://img.shields.io/badge/HuggingFace-Spaces-fbbf24?style=flat-square&logo=huggingface)
![License](https://img.shields.io/badge/License-MIT-39ff8e?style=flat-square)

---

## What It Is

Coalitus Collective is a mental-health NLP platform that layers multiple fine-tuned language models over every conversation. Instead of a single sentiment score, you get a **living emotional profile** updated with each message — built with counselors, students, and researchers in mind.

---

## Models

All 4 models are custom-trained and hosted on Hugging Face Spaces. No API key required.

| Model | Task | Classes | Architecture |
|---|---|---|---|
| **Emotion Classifier** | Detects core emotion in text | 6-class | DistilBERT fine-tuned |
| **Mental Health Topic Router** | Routes messages into support categories | 11-class | DistilBERT fine-tuned |
| **CBT Distortion Detector** | Flags cognitive distortions from CBT | 5-class · multi-label | RoBERTa fine-tuned |
| **Student Stress Predictor** | Predicts stress level from psychosocial inputs | 3-class | Tabular classifier |

---

## Features

- **Chat interface** — Emotion-aware conversational AI powered by Claude
- **Real-time analysis** — All 4 models run in parallel on every message
- **Ensemble consensus** — Weighted aggregate score across enabled models
- **Analysis view** — Per-model breakdown with confidence bars
- **Triage tool** — Priority-level pre-read for counselors (emotion + topic + distortion + crisis flag)
- **Models view** — Interactive docs with JS and Python code snippets
- **History view** — Full conversation log
- **Drag-to-reorder sidebar** — Customize which models run and in what order

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| UI Primitives | Radix UI (Tooltip, Switch, ScrollArea) |
| AI Chat | Anthropic Claude via `/api/chat` |
| NLP Models | HuggingFace Inference API |
| Fonts | Syne (display) + Space Mono (mono) |

---

## Project Structure

```
├── app/
│   ├── page.tsx                  # Root — renders EmotionChatPage
│   └── api/chat/route.ts         # Claude chat API route
│
├── components/
│   ├── chatbot/
│   │   ├── ChatMessage.jsx       # User / AI message bubbles
│   │   ├── ChatInput.jsx         # Textarea + send button
│   │   ├── ChatView.jsx          # Full chat panel
│   │   ├── ModelCard.jsx         # Draggable model card with results
│   │   ├── EmotionBar.jsx        # Score progress bar
│   │   ├── AnalysisView.jsx      # Per-model analysis panel
│   │   ├── TriageView.jsx        # Counseling triage tool
│   │   ├── ModelsView.jsx        # Model docs + code snippets
│   │   └── HistoryView.jsx       # Conversation history
│   │
│   ├── nav/
│   │   ├── TopBar.jsx            # Active tab indicator + model status
│   │   ├── LeftSidebar.jsx       # Nav tabs + active model strip
│   │   └── RightSidebar.jsx      # Model cards + ensemble consensus
│   │
│   └── home/
│       └── HomeView.jsx          # Landing page (full-screen)
│
└── lib/
    ├── constants.ts              # MY_MODELS, MODELS, NAV_ITEMS, API_SPACE_URL
    └── helpers.ts                # callHuggingFace, buildConsensus, fmt, topEmotion
```

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/coalitus-collective.git
cd coalitus-collective
npm install
```

### 2. Set environment variables

Create a `.env.local` file in the project root:

```env
ANTHROPIC_API_KEY=your_anthropic_key_here
NEXT_PUBLIC_API_SPACE_URL=https://your-hf-space.hf.space
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## API Usage

The unified `/analyze` endpoint accepts any text and returns emotion, topic, and distortion analysis in one call.

**JavaScript**
```js
const res = await fetch(`${API_SPACE_URL}/analyze`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "I feel so hopeless today.", distortion_threshold: 0.5 }),
});
const { emotion, topic, distortion } = await res.json();
```

**Python**
```python
import requests

r = requests.post(f"{API_SPACE_URL}/analyze", json={
    "text": "I feel so hopeless today.",
    "distortion_threshold": 0.5,
})
print(r.json())
```

The stress model uses a dedicated `/stress` endpoint that accepts 20 psychosocial input fields (anxiety level, sleep quality, academic load, etc.) and returns `low`, `medium`, or `high`.

---

## Palette & Design System

The UI follows a consistent dark design language shared across all views.

| Token | Value | Usage |
|---|---|---|
| Background | `#00091d` | Page + sidebar base |
| Dot grid | `#ffffff22` at `20px` | Texture overlay |
| Emerald | `#39ff8e` | Primary accent, chat, emotion |
| Cyan | `#22d3ee` | Analysis, right sidebar |
| Lime | `#a3e635` | Triage, how-it-works |
| Orange | `#fb923c` | Models, stress |
| Display font | Syne 700/800 | Headings, buttons |
| Mono font | Space Mono 400/700 | Labels, badges, code |

---

## License

MIT — free to use, modify, and distribute.

---

*Built with 🧠 for counselors, students, and researchers.*
