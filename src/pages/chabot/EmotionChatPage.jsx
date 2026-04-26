"use client";

import { AnalysisView } from "@/components/chatbot/AnalysisView";
import { ChatView }     from "@/components/chatbot/ChatView";
import { HistoryView }  from "@/components/chatbot/HistoryView";
import { TriageView }   from "@/components/chatbot/TriageView";
import { ModelsView }   from "@/components/chatbot/ModelsView";
import HomeView from "../home/HomeView"; 
import { LeftSidebar }  from "@/components/nav/LeftSidebar";
import { RightSidebar } from "@/components/nav/RightSidebar";
import { TopBar }       from "@/components/nav/TopBar";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useState, useCallback } from "react";

import { MODELS }          from "@/lib/constants";
import { buildConsensus }  from "@/lib/helpers"; // callHuggingFace removed — analysis is server-side now

const BLOBS = [
  { cls: "page-blob1", top: -220, left: -160,   w: 680, h: 680, color: "rgba(57,255,142,0.07)"  },
  { cls: "page-blob2", top: -100, right: -200,  w: 580, h: 580, color: "rgba(34,211,238,0.06)"  },
  { cls: "page-blob3", bottom: -200, left: "35%", w: 760, h: 580, color: "rgba(163,230,53,0.055)" },
  { cls: "page-blob4", bottom: -80, right: -60,  w: 280, h: 280, color: "rgba(251,146,60,0.05)"  },
];

const INITIAL_MESSAGE = {
  id: 1,
  role: "assistant",
  content: "Hello! I'm your Coalitus assistant. The models on the right will analyze our conversation in real time — drag to reorder, toggle to enable.",
  timestamp: new Date(),
};

export default function EmotionChatPage() {
  const [leftOpen,  setLeftOpen]  = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("home");

  const [messages,   setMessages]   = useState([INITIAL_MESSAGE]);
  const [input,      setInput]      = useState("");
  const [isLoading,  setIsLoading]  = useState(false);

  const [modelOrder,    setModelOrder]    = useState(MODELS.map(m => m.id));
  const [enabledModels, setEnabledModels] = useState(new Set(MODELS.map(m => m.id)));
  const [modelResults,  setModelResults]  = useState({});

  const [draggedModel,  setDraggedModel]  = useState(null);
  const [dragOverModel, setDragOverModel] = useState(null);

  const orderedModels   = modelOrder.map(id => MODELS.find(m => m.id === id)).filter(Boolean);
  const consensusScores = buildConsensus(modelResults, enabledModels);

  const toggleModel = useCallback((id) => {
    setEnabledModels(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = { id: Date.now(), role: "user", content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res  = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ messages: [...history, { role: "user", content: text }] }),
      });
      const data = await res.json();

      // ── Update model panels from server-side analysis ──
      // route.js runs all 4 HF Spaces and returns { content, analysis }
      // Only update the models that are currently enabled so disabled
      // panels don't suddenly show stale data.
      if (data.analysis && typeof data.analysis === "object") {
        setModelResults(prev => {
          const next = { ...prev };
          for (const id of enabledModels) {
            if (data.analysis[id]) next[id] = data.analysis[id];
          }
          return next;
        });
      }

      const reply = data.content ?? "Signal lost. Reconnecting…";
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: reply, timestamp: new Date() },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: "⚠ Connection error.", timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, enabledModels]);

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleDragStart = (e, id) => { setDraggedModel(id); e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver  = (e, id) => { e.preventDefault(); setDragOverModel(id); };
  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (!draggedModel || draggedModel === targetId) return;
    setModelOrder(prev => {
      const arr  = [...prev];
      const from = arr.indexOf(draggedModel);
      const to   = arr.indexOf(targetId);
      arr.splice(from, 1);
      arr.splice(to, 0, draggedModel);
      return arr;
    });
    setDraggedModel(null);
    setDragOverModel(null);
  };
  const handleDragEnd = () => { setDraggedModel(null); setDragOverModel(null); };

  if (activeTab === "home") {
    return <HomeView onEnter={() => setActiveTab("chat")} />;
  }

  return (
    <>
      <style>{`
        @keyframes page-blob-drift {
          0%,100% { transform:translate(0,0) scale(1); }
          33%      { transform:translate(24px,-16px) scale(1.04); }
          66%      { transform:translate(-16px,12px) scale(.97); }
        }
        .page-blob1{animation:page-blob-drift 16s ease-in-out infinite;}
        .page-blob2{animation:page-blob-drift 20s ease-in-out infinite reverse;}
        .page-blob3{animation:page-blob-drift 24s ease-in-out infinite 4s;}
        .page-blob4{animation:page-blob-drift 28s ease-in-out infinite 2s reverse;}
      `}</style>

      <TooltipProvider delayDuration={300}>
        <div className="flex h-screen overflow-hidden relative" style={{ background: "#00091d" }}>

          {/* background */}
          <div className="pointer-events-none fixed inset-0 z-0">
            <div className="absolute inset-0" style={{
              backgroundImage: "radial-gradient(#ffffff22 1px, #00091d 1px)",
              backgroundSize: "20px 20px",
            }} />
            {BLOBS.map(({ cls, top, left, right, bottom, w, h, color }) => (
              <div key={cls} className={`${cls} absolute rounded-full pointer-events-none`} style={{
                ...(top    !== undefined && { top }),
                ...(left   !== undefined && { left }),
                ...(right  !== undefined && { right }),
                ...(bottom !== undefined && { bottom }),
                width: w, height: h,
                background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
              }} />
            ))}
          </div>

          <LeftSidebar
            open={leftOpen}
            onToggle={() => setLeftOpen(v => !v)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            orderedModels={orderedModels}
            enabledModels={enabledModels}
          />

          <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
            <TopBar activeTab={activeTab} enabledModels={enabledModels} />
            <div className="flex-1 overflow-hidden flex flex-col">
              {activeTab === "chat"     && <ChatView messages={messages} isLoading={isLoading} input={input} onInputChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} onSend={sendMessage} />}
              {activeTab === "analysis" && <AnalysisView modelResults={modelResults} orderedModels={orderedModels} enabledModels={enabledModels} />}
              {activeTab === "triage"   && <TriageView />}
              {activeTab === "models"   && <ModelsView />}
              {activeTab === "history"  && <HistoryView messages={messages} />}
            </div>
          </main>

          <RightSidebar
            open={rightOpen}
            onToggle={() => setRightOpen(v => !v)}
            orderedModels={orderedModels}
            enabledModels={enabledModels}
            onToggleModel={toggleModel}
            modelResults={modelResults}
            draggedModel={draggedModel}
            dragOverModel={dragOverModel}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            consensusScores={consensusScores}
          />
        </div>
      </TooltipProvider>
    </>
  );
}