import { MaturityResult, MaturityDimension } from "@/types/maturity";

const MATURITY_STORAGE_KEY = 'maturity_assessment_data';
const MATURITY_HISTORY_KEY = 'maturity_assessment_history';

export interface StoredMaturityAssessment {
  id: string;
  timestamp: Date;
  result: MaturityResult;
  companyData: Record<string, any>;
  contactInfo: Record<string, any>;
}

export const saveMaturityAssessment = (
  result: MaturityResult,
  companyData: Record<string, any>,
  contactInfo: Record<string, any>
): void => {
  const assessment: StoredMaturityAssessment = {
    id: Date.now().toString(),
    timestamp: new Date(),
    result,
    companyData,
    contactInfo
  };

  // Save current assessment
  localStorage.setItem(MATURITY_STORAGE_KEY, JSON.stringify(assessment));

  // Add to history
  const history = getMaturityHistory();
  const updatedHistory = [assessment, ...history.slice(0, 9)]; // Keep last 10
  localStorage.setItem(MATURITY_HISTORY_KEY, JSON.stringify(updatedHistory));
};

export const getCurrentMaturityAssessment = (): StoredMaturityAssessment | null => {
  const stored = localStorage.getItem(MATURITY_STORAGE_KEY);
  if (!stored) return null;

  try {
    const data = JSON.parse(stored);
    return {
      ...data,
      timestamp: new Date(data.timestamp)
    };
  } catch {
    return null;
  }
};

export const getMaturityHistory = (): StoredMaturityAssessment[] => {
  const stored = localStorage.getItem(MATURITY_HISTORY_KEY);
  if (!stored) return [];

  try {
    const data = JSON.parse(stored);
    return data.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));
  } catch {
    return [];
  }
};

export const convertStoredDataToRadarData = (stored: StoredMaturityAssessment | null): MaturityDimension[] => {
  if (!stored) {
    // Return default IBGC dimensions with zero scores
    return [
      { name: "Propósito", score: 0, sectorAverage: 3.5, fullMark: 5 },
      { name: "Liderança", score: 0, sectorAverage: 3.6, fullMark: 5 },
      { name: "Estratégia", score: 0, sectorAverage: 3.4, fullMark: 5 },
      { name: "Riscos e Controles", score: 0, sectorAverage: 3.7, fullMark: 5 },
      { name: "Transparência", score: 0, sectorAverage: 3.3, fullMark: 5 },
      { name: "Empresas Familiares", score: 0, sectorAverage: 3.2, fullMark: 5 }
    ];
  }

  const { pontuacao_dimensoes, pontuacao_empresas_familiares } = stored.result;

  return [
    {
      name: "Propósito",
      score: pontuacao_dimensoes["dimensao_01"] || 0,
      sectorAverage: 3.5,
      fullMark: 5
    },
    {
      name: "Liderança", 
      score: pontuacao_dimensoes["dimensao_02"] || 0,
      sectorAverage: 3.6,
      fullMark: 5
    },
    {
      name: "Estratégia",
      score: pontuacao_dimensoes["dimensao_03"] || 0,
      sectorAverage: 3.4,
      fullMark: 5
    },
    {
      name: "Riscos e Controles",
      score: pontuacao_dimensoes["dimensao_04"] || 0,
      sectorAverage: 3.7,
      fullMark: 5
    },
    {
      name: "Transparência",
      score: pontuacao_dimensoes["dimensao_05"] || 0,
      sectorAverage: 3.3,
      fullMark: 5
    },
    {
      name: "Empresas Familiares",
      score: pontuacao_empresas_familiares?.percentual ? 
        (pontuacao_empresas_familiares.percentual * 5 / 100) : 0,
      sectorAverage: 3.2,
      fullMark: 5
    }
  ];
};