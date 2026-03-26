import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MaturityInsights from "@/components/MaturityInsights";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getCurrentMaturityAssessment, convertStoredDataToRadarData } from "@/utils/maturityStorage";

const Insights = () => {
  const [maturityData, setMaturityData] = useState(convertStoredDataToRadarData(null));

  useEffect(() => {
    const currentAssessment = getCurrentMaturityAssessment();
    setMaturityData(convertStoredDataToRadarData(currentAssessment));
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Insights Estratégicos" />
        <div className="flex-1 overflow-y-auto p-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-legacy-500 mb-6">
                Análise Estratégica de Maturidade
              </h2>
              <MaturityInsights data={maturityData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Insights;
