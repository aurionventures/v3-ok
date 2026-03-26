import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { MarketIntelligenceTab } from "@/components/risks/MarketIntelligenceTab";

const MarketIntelligence = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Inteligência de Mercado" />
        <div className="flex-1 overflow-y-auto p-6">
          <MarketIntelligenceTab />
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligence;
