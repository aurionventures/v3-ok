export interface CapTableRow {
  id: string;
  empresa_id: string;
  participante: string;
  participacao_pct: number | null;
  tipo: string | null;
  quotas: number | null;
  data_entrada: string | null;
  tipo_aquisicao: string | null;
  valor: number | null;
  familia: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface CapTableShareholder {
  id: string;
  name: string;
  type: string;
  percentage: number;
  shares: number;
  entryDate: string;
  acquisitionType: string;
  value: number;
  family: boolean;
}

export interface CapTableInsert {
  empresa_id: string;
  participante: string;
  participacao_pct?: number | null;
  tipo?: string | null;
  quotas?: number | null;
  data_entrada?: string | null;
  tipo_aquisicao?: string | null;
  valor?: number | null;
  familia?: boolean | null;
}
