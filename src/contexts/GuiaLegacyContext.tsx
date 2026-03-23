import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import GuidedNavigation from "@/components/GuidedNavigation";

interface GuiaLegacyContextValue {
  openGuidedNav: () => void;
}

const GuiaLegacyContext = createContext<GuiaLegacyContextValue | null>(null);

export function GuiaLegacyProvider({ children }: { children: ReactNode }) {
  const [showGuidedNav, setShowGuidedNav] = useState(false);

  const openGuidedNav = useCallback(() => setShowGuidedNav(true), []);
  const closeGuidedNav = useCallback(() => setShowGuidedNav(false), []);

  return (
    <GuiaLegacyContext.Provider value={{ openGuidedNav }}>
      {children}
      <GuidedNavigation isOpen={showGuidedNav} onClose={closeGuidedNav} />
    </GuiaLegacyContext.Provider>
  );
}

export function useGuiaLegacy() {
  const ctx = useContext(GuiaLegacyContext);
  return ctx;
}
