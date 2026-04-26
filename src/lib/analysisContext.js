"use client";

import { createContext, useContext, useState, useCallback } from "react";

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [modelResults, setModelResults] = useState({
    emotion:    {},
    topic:      {},
    distortion: {},
    stress:     {},
  });
  const [isAnalysing, setIsAnalysing] = useState(false);

  const updateAnalysis = useCallback((analysis) => {
    if (!analysis) return;
    setModelResults({
      emotion:    analysis.emotion    ?? {},
      topic:      analysis.topic      ?? {},
      distortion: analysis.distortion ?? {},
      stress:     analysis.stress     ?? {},
    });
  }, []);

  return (
    <AnalysisContext.Provider value={{ modelResults, isAnalysing, setIsAnalysing, updateAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysis must be used inside <AnalysisProvider>");
  return ctx;
}