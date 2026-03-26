import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MaturityGlobalIndicator from "@/components/MaturityGlobalIndicator";
import SectorRanking from "@/components/SectorRanking";
import { useEffect, useState } from "react";
import { getCurrentMaturityAssessment, convertStoredDataToRadarData } from "@/utils/maturityStorage";

const Benchmarking = () => {
  const [maturityData, setMaturityData] = useState(convertStoredDataToRadarData(null));

  useEffect(() => {
    const currentAssessment = getCurrentMaturityAssessment();
    setMaturityData(convertStoredDataToRadarData(currentAssessment));
  }, []);

  const averageScore = maturityData.reduce((acc, item) => acc + item.score, 0) / maturityData.length;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Benchmarking Global" />
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <MaturityGlobalIndicator data={maturityData} />
          <SectorRanking currentCompanyScore={averageScore} sector="Tecnologia" />
        </div>
      </div>
    </div>
  );
};

export default Benchmarking;
