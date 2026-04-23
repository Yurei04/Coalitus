"use client";

import { AnalysisView } from "@/components/chatbot/AnalysisView";
import { ChatView } from "@/components/chatbot/ChatView"; 
import { HistoryView } from "@/components/chatbot/HistoryView";
import { TriageView } from "@/components/chatbot/TriageView";
import { ModelsView } from "@/components/chatbot/ModelsView";
import { HomeView } from "../home/HomeView"; 
import { LeftSidebar } from "@/components/nav/LeftSidebar";
import { RightSidebar } from "@/components/nav/RightSidebar";
import { TopBar } from "@/components/nav/TopBar";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useState, useCallback } from "react";

import { MODELS } from "@/lib/constants";
import { callHuggingFace, buildConsensus } from "@/lib/helpers";

const INITIAL_MESSAGE = {
  id: 1,
  role: "assistant",
  content:
    "Hello! I'm your emotion-aware assistant. The models on the right will analyze our conversation in real time — drag to reorder, toggle to enable.",
  timestamp: new Date(),
};

export default function EmotionChatPage() {
  /* ── Layout state ── */
  const [leftOpen, setLeftOpen]   = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  /* Home is the default landing tab */
  const [activeTab, setActiveTab] = useState("home");

  /* ── Chat state ── */
  const [messages, setMessages]   = useState([INITIAL_MESSAGE]);
  const [input, setInput]         = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* ── Model state ── */
  const [modelOrder, setModelOrder]       = useState(MODELS.map((m) => m.id));
  const [enabledModels, setEnabledModels] = useState(new Set(MODELS.map((m) => m.id)));
  const [modelResults, setModelResults]   = useState({});

  /* ── Drag state ── */
  const [draggedModel, setDraggedModel]   = useState(null);
  const [dragOverModel, setDragOverModel] = useState(null);

  /* ── Derived ── */
  const orderedModels   = modelOrder.map((id) => MODELS.find((m) => m.id === id)).filter(Boolean);
  const consensusScores = buildConsensus(modelResults, enabledModels);

  /* ── Handlers ── */
  const toggleModel = useCallback((id) => {
    setEnabledModels((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const runAnalysis = useCallback(async (text) => {
    const active = MODELS.filter((m) => enabledModels.has(m.id));
    const entries = await Promise.all(
      active.map(async (m) => [m.id, await callHuggingFace(text, m.hfId)])
    );
    setModelResults((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
  }, [enabledModels]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = { id: Date.now(), role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    runAnalysis(text);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res  = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...history, { role: "user", content: text }] }),
      });
      const data  = await res.json();
      const reply = data.content ?? "Signal lost. Reconnecting…";
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: reply, timestamp: new Date() },
      ]);
      runAnalysis(reply);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: "⚠ Connection error. Check Settings.", timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, runAnalysis]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  /* ── Drag handlers ── */
  const handleDragStart = (e, id) => { setDraggedModel(id); e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver  = (e, id) => { e.preventDefault(); setDragOverModel(id); };
  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (!draggedModel || draggedModel === targetId) return;
    setModelOrder((prev) => {
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

  /* ── When on the home tab, render HomeView full-screen without chrome ── */
  if (activeTab === "home") {
    return (
      <HomeView onEnter={() => setActiveTab("chat")} />
    );
  }

  /* ── App shell (all other tabs) ── */
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-screen overflow-hidden relative" style={{ background: "#0c0e12" }}>

        {/* ── Global ambient layer ── */}
        <div className="pointer-events-none fixed inset-0 z-0">
          {/* Dot grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {/* Green bleed — top-left */}
          <div style={{ position: "absolute", top: -200, left: -150, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 65%)" }} />
          {/* Cyan bleed — top-right */}
          <div style={{ position: "absolute", top: -100, right: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 65%)" }} />
          {/* Purple bleed — bottom-center */}
          <div style={{ position: "absolute", bottom: -200, left: "35%", width: 800, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 65%)" }} />
          {/* Pink bleed — bottom-right */}
          <div style={{ position: "absolute", bottom: -80, right: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,114,182,0.05) 0%, transparent 65%)" }} />
        </div>

        <LeftSidebar
          open={leftOpen}
          onToggle={() => setLeftOpen((v) => !v)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          orderedModels={orderedModels}
          enabledModels={enabledModels}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
          <TopBar activeTab={activeTab} enabledModels={enabledModels} />

          <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === "chat"     && (
              <ChatView
                messages={messages}
                isLoading={isLoading}
                input={input}
                onInputChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onSend={sendMessage}
              />
            )}
            {activeTab === "analysis" && (
              <AnalysisView
                modelResults={modelResults}
                orderedModels={orderedModels}
                enabledModels={enabledModels}
              />
            )}
            {activeTab === "triage"   && <TriageView />}
            {activeTab === "models"   && <ModelsView />}
            {activeTab === "history"  && <HistoryView messages={messages} />}
          </div>
        </main>

        <RightSidebar
          open={rightOpen}
          onToggle={() => setRightOpen((v) => !v)}
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
  );
}