import { MaturityResult, MaturityDimension } from "@/types/maturity";

const MATURITY_STORAGE_KEY = 'maturity_assessment_data';
const MATURITY_HISTORY_KEY = 'maturity_assessment_history';

const ASSESSMENT_VERSION = "1.0";

export interface StoredMaturityAssessment {
  id: string;
  version: string;
  timestamp: Date;
  result: MaturityResult;
  companyData: Record<string, any>;
  contactInfo: Record<string, any>;
}

export const saveMaturityAssessment = (
  result: MaturityResult,
  companyData: Record<string, any>,
  contactInfo?: Record<string, any>
): void => {
  const assessment: StoredMaturityAssessment = {
    id: Date.now().toString(),
    version: ASSESSMENT_VERSION,
    timestamp: new Date(),
    result,
    companyData,
    contactInfo: contactInfo ?? {}
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
      version: data.version ?? ASSESSMENT_VERSION,
      timestamp: new Date(data.timestamp)
    };
  } catch {
    return null;
  }
};

export const clearMaturityData = (): void => {
  localStorage.removeItem(MATURITY_STORAGE_KEY);
  localStorage.removeItem(MATURITY_HISTORY_KEY);
};

export const getMaturityHistory = (): StoredMaturityAssessment[] => {
  const stored = localStorage.getItem(MATURITY_HISTORY_KEY);
  if (!stored) return [];

  try {
    const data = JSON.parse(stored);
    return data.map((item: any) => ({
      ...item,
      version: item.version ?? ASSESSMENT_VERSION,
      timestamp: new Date(item.timestamp)
    }));
  } catch {
    return [];
  }
};

const SECTOR_BENCHMARKS: Record<string, number> = {
  "Sócios": 3.2,
  "Conselho": 2.8,
  "Diretoria": 3.0,
  "Órgãos de fiscalização e controle": 2.5,
  "Conduta e conflitos de interesses": 2.7,
  "Empresas Familiares": 3.2,
};

export const convertStoredDataToRadarData = (stored: StoredMaturityAssessment | null): MaturityDimension[] => {
  if (!stored) {
    return [
      { name: "Sócios", score: 0, sectorAverage: 3.2, fullMark: 5 },
      { name: "Conselho", score: 0, sectorAverage: 2.8, fullMark: 5 },
      { name: "Diretoria", score: 0, sectorAverage: 3.0, fullMark: 5 },
      { name: "Órgãos de fiscalização e controle", score: 0, sectorAverage: 2.5, fullMark: 5 },
      { name: "Conduta e conflitos de interesses", score: 0, sectorAverage: 2.7, fullMark: 5 },
    ];
  }

  const { pontuacao_dimensoes, pontuacao_empresas_familiares } = stored.result;
  const dimensions: MaturityDimension[] = [];

  if (!pontuacao_dimensoes || typeof pontuacao_dimensoes !== "object") {
    return [
      { name: "Sócios", score: 0, sectorAverage: 3.2, fullMark: 5 },
      { name: "Conselho", score: 0, sectorAverage: 2.8, fullMark: 5 },
      { name: "Diretoria", score: 0, sectorAverage: 3.0, fullMark: 5 },
      { name: "Órgãos de fiscalização e controle", score: 0, sectorAverage: 2.5, fullMark: 5 },
      { name: "Conduta e conflitos de interesses", score: 0, sectorAverage: 2.7, fullMark: 5 },
    ];
  }

  for (const [name, percentual] of Object.entries(pontuacao_dimensoes)) {
    const num = typeof percentual === "number" ? percentual : Number(percentual);
    const score = Number.isFinite(num) ? num * 5 : 0;
    dimensions.push({
      name,
      score,
      sectorAverage: SECTOR_BENCHMARKS[name] ?? 3.0,
      fullMark: 5,
    });
  }

  if (pontuacao_empresas_familiares?.percentual !== undefined) {
    const num = Number(pontuacao_empresas_familiares.percentual);
    const score = Number.isFinite(num) ? num * 5 : 0;
    dimensions.push({
      name: "Empresas Familiares",
      score,
      sectorAverage: 3.2,
      fullMark: 5,
    });
  }

  return dimensions;
};