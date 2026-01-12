
import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationBell from "./NotificationBell";
import GovernanceAssistant from "./GovernanceAssistant";

interface HeaderProps {
  title?: string;
}

const Header = ({ title = "Dashboard" }: HeaderProps) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="flex items-center space-x-3">
          {/* Botão Guia Legacy */}
          <Button 
            onClick={() => setShowGuide(true)}
            className="bg-legacy-500 hover:bg-legacy-600 text-white rounded-full px-4 py-2"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Guia Legacy
          </Button>

          <NotificationBell />
        </div>
      </header>

      {/* Governance Assistant controlado pelo Header */}
      <GovernanceAssistant 
        isOpen={showGuide} 
        onOpenChange={setShowGuide} 
      />
    </>
  );
};

export default Header;
