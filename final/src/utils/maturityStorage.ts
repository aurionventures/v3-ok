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
  if (!stored) {
    // Initialize with mock data if no history exists
    initializeMockHistory();
    return getMaturityHistory();
  }

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

const initializeMockHistory = (): void => {
  const mockHistory: StoredMaturityAssessment[] = [
    {
      id: "assessment-2024-06",
      timestamp: new Date(2024, 5, 15),
      result: {
        pontuacao_total: 2.45, // Pontos (0-5)
        estagio: "Básico",
        pontuacao_dimensoes: {
          "Sócios": 2.1, // Pontos (0-5)
          "Conselho": 3.0, // Pontos (0-5)
          "Diretoria": 4.0, // Pontos (0-5)
          "Órgãos de fiscalização e controle": 1.0, // Pontos (0-5)
          "Conduta e conflitos de interesses": 1.75 // Pontos (0-5)
        },
        pontuacao_indicadores: {
          "indicador_01": 2.1,
          "indicador_02": 3.0,
          "indicador_03": 4.0,
          "indicador_04": 1.0,
          "indicador_05": 1.75,
        },
        pontuacao_empresas_controle_concentrado: { percentual: 0.25, pontos: 1.25 }
      },
      companyData: { nome: "TechCorp Ltda", setor: "Tecnologia" },
      contactInfo: { analista: "Maria Silva" }
    },
    {
      id: "assessment-2025-01",
      timestamp: new Date(2025, 0, 20),
      result: {
        pontuacao_total: 3.1, // Pontos (0-5)
        estagio: "Básico",
        pontuacao_dimensoes: {
          "Sócios": 3.25, // Pontos (0-5)
          "Conselho": 2.9, // Pontos (0-5)
          "Diretoria": 3.4, // Pontos (0-5)
          "Órgãos de fiscalização e controle": 2.75, // Pontos (0-5)
          "Conduta e conflitos de interesses": 3.2 // Pontos (0-5)
        },
        pontuacao_indicadores: {
          "indicador_01": 3.1,
          "indicador_02": 3.4,
          "indicador_03": 3.2,
          "indicador_04": 3.6,
          "indicador_05": 3.7,
        },
        pontuacao_empresas_controle_concentrado: { percentual: 0.68, pontos: 3.4 }
      },
      companyData: { nome: "TechCorp Ltda", setor: "Tecnologia" },
      contactInfo: { analista: "João Costa" }
    }
  ];

  localStorage.setItem(MATURITY_HISTORY_KEY, JSON.stringify(mockHistory));
};

export const convertStoredDataToRadarData = (stored: StoredMaturityAssessment | null): MaturityDimension[] => {
  if (!stored) {
    // Return default IBGC dimensions with varied scores for visual demonstration
    return [
      { name: "Sócios", score: 2.1, sectorAverage: 3.2, fullMark: 5 },
      { name: "Conselho", score: 3.0, sectorAverage: 2.8, fullMark: 5 },
      { name: "Diretoria", score: 4.0, sectorAverage: 3.0, fullMark: 5 },
      { name: "Órgãos de Fiscalização", score: 1.0, sectorAverage: 2.5, fullMark: 5 },
      { name: "Conduta e Conflitos", score: 1.75, sectorAverage: 2.7, fullMark: 5 }
    ];
  }

  const { pontuacao_dimensoes } = stored.result;

  return [
    {
      name: "Sócios",
      score: pontuacao_dimensoes["Sócios"] || 0, // Já está em pontos (0-5)
      sectorAverage: 3.2,
      fullMark: 5
    },
    {
      name: "Conselho", 
      score: pontuacao_dimensoes["Conselho"] || 0, // Já está em pontos (0-5)
      sectorAverage: 2.8,
      fullMark: 5
    },
    {
      name: "Diretoria",
      score: pontuacao_dimensoes["Diretoria"] || 0, // Já está em pontos (0-5)
      sectorAverage: 3.0,
      fullMark: 5
    },
    {
      name: "Órgãos de Fiscalização",
      score: pontuacao_dimensoes["Órgãos de fiscalização e controle"] || 0, // Já está em pontos (0-5)
      sectorAverage: 2.5,
      fullMark: 5
    },
    {
      name: "Conduta e Conflitos",
      score: pontuacao_dimensoes["Conduta e conflitos de interesses"] || 0, // Já está em pontos (0-5)
      sectorAverage: 2.7,
      fullMark: 5
    }
  ];
};