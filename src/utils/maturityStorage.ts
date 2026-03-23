import { MaturityResult, MaturityDimension } from "@/types/maturity";

const MATURITY_STORAGE_KEY = "maturity_assessment_data";
const MATURITY_HISTORY_KEY = "maturity_assessment_history";

/** Chave scoped por empresa – cada empresa nova não herda dados de outra */
function storageKey(base: string, empresaId: string | null | undefined): string {
  return empresaId ? `${base}_${empresaId}` : base;
}

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
  contactInfo?: Record<string, any>,
  empresaId?: string | null
): void => {
  const assessment: StoredMaturityAssessment = {
    id: Date.now().toString(),
    version: ASSESSMENT_VERSION,
    timestamp: new Date(),
    result,
    companyData,
    contactInfo: contactInfo ?? {},
  };

  const key = storageKey(MATURITY_STORAGE_KEY, empresaId);
  const historyKey = storageKey(MATURITY_HISTORY_KEY, empresaId);

  localStorage.setItem(key, JSON.stringify(assessment));

  const history = getMaturityHistory(empresaId);
  const updatedHistory = [assessment, ...history.slice(0, 9)];
  localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
};

export const getCurrentMaturityAssessment = (
  empresaId?: string | null
): StoredMaturityAssessment | null => {
  const key = storageKey(MATURITY_STORAGE_KEY, empresaId);
  const stored = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  if (!stored) return null;

  try {
    const data = JSON.parse(stored);
    return {
      ...data,
      version: data.version ?? ASSESSMENT_VERSION,
      timestamp: new Date(data.timestamp),
    };
  } catch {
    return null;
  }
};

export const clearMaturityData = (empresaId?: string | null): void => {
  const key = storageKey(MATURITY_STORAGE_KEY, empresaId);
  const historyKey = storageKey(MATURITY_HISTORY_KEY, empresaId);
  localStorage.removeItem(key);
  localStorage.removeItem(historyKey);
};

export const getMaturityHistory = (
  empresaId?: string | null
): StoredMaturityAssessment[] => {
  const historyKey = storageKey(MATURITY_HISTORY_KEY, empresaId);
  const stored =
    typeof window !== "undefined" ? localStorage.getItem(historyKey) : null;
  if (!stored) return [];

  try {
    const data = JSON.parse(stored);
    return data.map((item: any) => ({
      ...item,
      version: item.version ?? ASSESSMENT_VERSION,
      timestamp: new Date(item.timestamp),
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