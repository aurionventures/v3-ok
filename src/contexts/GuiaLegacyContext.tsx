import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import LegacyGuideChat from "@/components/LegacyGuideChat";

interface GuiaLegacyContextValue {
  openGuidedNav: () => void;
}

const GuiaLegacyContext = createContext<GuiaLegacyContextValue | null>(null);

export function GuiaLegacyProvider({ children }: { children: ReactNode }) {
  const [showGuide, setShowGuide] = useState(false);

  const openGuidedNav = useCallback(() => setShowGuide(true), []);
  const closeGuide = useCallback(() => setShowGuide(false), []);

  return (
    <GuiaLegacyContext.Provider value={{ openGuidedNav }}>
      {children}
      <LegacyGuideChat isOpen={showGuide} onClose={closeGuide} />
    </GuiaLegacyContext.Provider>
  );
}

export function useGuiaLegacy() {
  const ctx = useContext(GuiaLegacyContext);
  return ctx;
}
