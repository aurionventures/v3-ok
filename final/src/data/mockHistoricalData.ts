import { MaturityResult } from "@/types/maturity";

export interface HistoricalAssessment {
  id: string;
  date: Date;
  period: string;
  analyst: string;
  analystInitials: string;
  result: MaturityResult;
  companyData: Record<string, any>;
  status: 'completed' | 'in_progress' | 'scheduled';
  recommendations: string[];
  keyInsights: string[];
  nextSteps: string[];
}

export const mockHistoricalAssessments: HistoricalAssessment[] = [
  {
    id: "assessment-2024-06",
    date: new Date(2024, 5, 15), // June 2024
    period: "Jun/2024",
    analyst: "Maria Silva",
    analystInitials: "MS",
    status: 'completed',
    result: {
      pontuacao_total: 2.5, // Pontos (0-5)
      estagio: "Básico",
      pontuacao_dimensoes: {
        "Sócios": 2.4, // Pontos (0-5)
        "Conselho": 2.25, // Pontos (0-5)
        "Diretoria": 2.6, // Pontos (0-5)
        "Órgãos de fiscalização e controle": 2.4, // Pontos (0-5)
        "Conduta e conflitos de interesses": 2.75 // Pontos (0-5)
      },
      pontuacao_indicadores: {
        "indicador_01": 2.5,
        "indicador_02": 2.8,
        "indicador_03": 2.6,
        "indicador_04": 3.0,
        "indicador_05": 3.1,
      },
      pontuacao_empresas_controle_concentrado: { percentual: 0.52, pontos: 2.6 }
    },
    companyData: {
      nome: "TechCorp Ltda",
      setor: "Tecnologia",
      funcionarios: "50-100"
    },
    recommendations: [
      "Implementar estrutura formal de governança corporativa",
      "Definir políticas claras de conflito de interesses",
      "Estabelecer comitês de auditoria independentes",
      "Desenvolver código de ética e conduta corporativa"
    ],
    keyInsights: [
      "Empresa em estágio inicial de implementação de governança",
      "Forte potencial de crescimento identificado",
      "Necessidade de formalização de processos",
      "Liderança comprometida com mudanças"
    ],
    nextSteps: [
      "Criação de conselho de administração",
      "Implementação de política de riscos",
      "Treinamento em governança para liderança",
      "Estabelecimento de canais de comunicação transparentes"
    ]
  },
  {
    id: "assessment-2025-01",
    date: new Date(2025, 0, 20), // January 2025
    period: "Jan/2025",
    analyst: "João Costa",
    analystInitials: "JC",
    status: 'completed',
    result: {
      pontuacao_total: 3.0, // Pontos (0-5)
      estagio: "Básico",
      pontuacao_dimensoes: {
        "Sócios": 3.1, // Pontos (0-5)
        "Conselho": 2.9, // Pontos (0-5)
        "Diretoria": 3.15, // Pontos (0-5)
        "Órgãos de fiscalização e controle": 2.8, // Pontos (0-5)
        "Conduta e conflitos de interesses": 3.05 // Pontos (0-5)
      },
      pontuacao_indicadores: {
        "indicador_01": 3.0,
        "indicador_02": 3.2,
        "indicador_03": 3.1,
        "indicador_04": 3.4,
        "indicador_05": 3.3,
      },
      pontuacao_empresas_controle_concentrado: { percentual: 0.61, pontos: 3.05 }
    },
    companyData: {
      nome: "TechCorp Ltda",
      setor: "Tecnologia",
      funcionarios: "100-250"
    },
    recommendations: [
      "Aprimorar processos de gestão de riscos estratégicos",
      "Expandir programas de compliance e ética",
      "Implementar dashboard de indicadores de governança",
      "Desenvolver política de divulgação de informações"
    ],
    keyInsights: [
      "Evolução significativa em estruturas de governança",
      "Melhorias notáveis em transparência e controles",
      "Crescimento sustentável da organização",
      "Maior engajamento das partes interessadas"
    ],
    nextSteps: [
      "Certificação em padrões internacionais de governança",
      "Implementação de ESG framework",
      "Auditoria externa de processos",
      "Expansão do programa de integridade"
    ]
  },
  {
    id: "assessment-2025-06",
    date: new Date(2025, 5, 10), // June 2025
    period: "Jun/2025",
    analyst: "Ana Santos",
    analystInitials: "AS",
    status: 'completed',
    result: {
      pontuacao_total: 4.0, // Pontos (0-5)
      estagio: "Sólido",
      pontuacao_dimensoes: {
        "Sócios": 4.1, // Pontos (0-5)
        "Conselho": 3.9, // Pontos (0-5)
        "Diretoria": 4.25, // Pontos (0-5)
        "Órgãos de fiscalização e controle": 3.8, // Pontos (0-5)
        "Conduta e conflitos de interesses": 3.95 // Pontos (0-5)
      },
      pontuacao_indicadores: {
        "indicador_01": 4.0,
        "indicador_02": 4.2,
        "indicador_03": 4.1,
        "indicador_04": 4.3,
        "indicador_05": 4.4,
      },
      pontuacao_empresas_controle_concentrado: { percentual: 0.81, pontos: 4.05 }
    },
    companyData: {
      nome: "TechCorp Ltda",
      setor: "Tecnologia",
      funcionarios: "250-500"
    },
    recommendations: [
      "Implementar práticas de governança digital avançada",
      "Desenvolver métricas de impacto social e ambiental",
      "Estabelecer comitê de inovação e sustentabilidade",
      "Criar programa de mentoria em governança"
    ],
    keyInsights: [
      "Excelência em práticas de governança corporativa",
      "Referência no setor de tecnologia",
      "Integração efetiva de ESG na estratégia",
      "Cultura organizacional sólida e ética"
    ],
    nextSteps: [
      "Benchmark com empresas globais líderes",
      "Implementação de AI/ML em governança",
      "Expansão internacional com governança robusta",
      "Desenvolvimento de case study para mercado"
    ]
  }
];

export const getHistoricalTrend = () => {
  return mockHistoricalAssessments.map(assessment => ({
    period: assessment.period,
    score: assessment.result.pontuacao_total,
    stage: assessment.result.estagio
  }));
};

export const getDimensionEvolution = () => {
  const dimensions = ["Sócios", "Conselho", "Diretoria", "Órgãos de fiscalização e controle", "Conduta e conflitos de interesses"];
  
  return dimensions.map(dimension => {
    const evolution = mockHistoricalAssessments.map(assessment => {
      return {
        period: assessment.period,
        score: assessment.result.pontuacao_dimensoes[dimension] || 0
      };
    });
    
    return {
      dimension,
      evolution
    };
  });
};