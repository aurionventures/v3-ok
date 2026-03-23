const PLANOS_STORAGE_KEY = "legacy_planos_assinatura";

export interface PlanoAssinatura {
  id: string;
  name: string;
  description: string;
  empresas: number;
  usuarios: string;
  addons: number;
}

const planosIniciais: PlanoAssinatura[] = [
  { id: "1", name: "Essencial", description: "Plano básico", empresas: 1, usuarios: "∞", addons: 0 },
  { id: "2", name: "Profissional", description: "Para crescimento", empresas: 1, usuarios: "∞", addons: 2 },
  { id: "3", name: "Business", description: "Médias empresas", empresas: 1, usuarios: "∞", addons: 3 },
  { id: "4", name: "Enterprise", description: "Solução completa", empresas: 1, usuarios: "∞", addons: 6 },
];

export function getPlanos(): PlanoAssinatura[] {
  try {
    const stored = localStorage.getItem(PLANOS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as PlanoAssinatura[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* ignore */
  }
  return planosIniciais;
}

export function setPlanos(planos: PlanoAssinatura[]): void {
  try {
    localStorage.setItem(PLANOS_STORAGE_KEY, JSON.stringify(planos));
  } catch {
    /* ignore */
  }
}
