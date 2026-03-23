const PLANOS_STORAGE_KEY = "legacy_planos_assinatura";

export interface PlanoAssinatura {
  id: string;
  name: string;
  description: string;
  empresas: number;
  usuarios: string;
  valor: number;
}

const planosIniciais: PlanoAssinatura[] = [
  { id: "1", name: "Essencial", description: "Plano básico", empresas: 1, usuarios: "∞", valor: 3490 },
  { id: "2", name: "Profissional", description: "Para crescimento", empresas: 1, usuarios: "∞", valor: 5490 },
  { id: "3", name: "Business", description: "Médias empresas", empresas: 1, usuarios: "∞", valor: 7490 },
  { id: "4", name: "Enterprise", description: "Solução completa", empresas: 1, usuarios: "∞", valor: 12490 },
];

export function getPlanos(): PlanoAssinatura[] {
  try {
    const stored = localStorage.getItem(PLANOS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Array<Partial<PlanoAssinatura> & { addons?: number }>;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => ({
          id: p.id ?? "",
          name: p.name ?? "",
          description: p.description ?? "",
          empresas: p.empresas ?? 1,
          usuarios: p.usuarios ?? "∞",
          valor: typeof p.valor === "number" ? p.valor : 3490,
        }));
      }
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
