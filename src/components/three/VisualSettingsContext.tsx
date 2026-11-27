"use client";

import React, { createContext, useContext, useState, type ReactNode } from "react";

interface VisualSettingsValue {
  ecoMode: boolean;
  setEcoMode: (v: boolean) => void;
  toggleEcoMode: () => void;
  selectedTechIdExternal: string | null;
  jumpToTech: (techId: string) => void;
  clearSelectedTechExternal: () => void;
}

const VisualSettingsContext = createContext<VisualSettingsValue | null>(null);

export function VisualSettingsProvider({ children }: { children: ReactNode }) {
  const [ecoMode, setEcoMode] = useState(false);
  const [selectedTechIdExternal, setSelectedTechIdExternal] = useState<
    string | null
  >(null);

  return (
    <VisualSettingsContext.Provider
      value={{
        ecoMode,
        setEcoMode,
        toggleEcoMode: () => setEcoMode((p) => !p),
        selectedTechIdExternal,
        jumpToTech: (id: string) => setSelectedTechIdExternal(id),
        clearSelectedTechExternal: () => setSelectedTechIdExternal(null),
      }}
    >
      {children}
    </VisualSettingsContext.Provider>
  );
}

export function useVisualSettings() {
  const ctx = useContext(VisualSettingsContext);
  if (!ctx) {
    throw new Error(
      "useVisualSettings must be used within VisualSettingsProvider"
    );
  }
  return ctx;
}
