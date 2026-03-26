import { ESGMaturityResult } from "@/types/esgMaturity";

export interface MockESGAssessment {
  id: string;
  timestamp: Date;
  period: string;
  analyst: string;
  analystInitials: string;
  status: 'completed' | 'in_progress' | 'scheduled';
  result: ESGMaturityResult;
  companyData: Record<string, any>;
  recommendations: string[];
  keyInsights: string[];
  nextSteps: string[];
}

export const mockESGAssessments: MockESGAssessment[] = [
  {
    id: "esg-assessment-2024-03",
    timestamp: new Date(2024, 2, 15), // March 2024
    period: "Mar/2024",
    analyst: "Dr. Carolina Lima",
    analystInitials: "CL",
    status: 'completed',
    result: {
      overallScore: 2.8,
      maturityLevel: {
        level: 3,
        name: "Estratégico",
        description: "ESG como oportunidade de negócio, com metas e indicadores",
        color: "bg-yellow-500"
      },
      pillarScores: {
        environmental: {
          title: "Ambiental",
          score: 2.5,
          maxScore: 6,
          percentage: 41.7,
          maturityLevel: 3,
          questions: 25,
          subDimensions: {
            "Mudanças Climáticas": 2.3,
            "Gestão de Recursos Naturais": 2.8,
            "Biodiversidade e Ecossistemas": 2.2,
            "Gestão de Resíduos e Poluição": 2.7
          }
        },
        social: {
          title: "Social",
          score: 3.2,
          maxScore: 6,
          percentage: 53.3,
          maturityLevel: 3,
          questions: 25,
          subDimensions: {
            "Capital Humano": 3.5,
            "Relações com a Comunidade": 2.8,
            "Direitos Humanos": 3.0,
            "Responsabilidade com o Cliente": 3.4
          }
        },
        governance: {
          title: "Governança",
          score: 2.9,
          maxScore: 6,
          percentage: 48.3,
          maturityLevel: 3,
          questions: 20,
          subDimensions: {
            "Estrutura de Governança ESG": 3.1,
            "Ética e Conduta Empresarial": 2.8,
            "Gestão de Riscos ESG": 2.7,
            "Transparência e Relato": 3.0
          }
        },
        strategy: {
          title: "Estratégia",
          score: 2.6,
          maxScore: 6,
          percentage: 43.3,
          maturityLevel: 3,
          questions: 10,
          subDimensions: {
            "Integração ESG na Estratégia": 2.8,
            "Stakeholder Engagement": 2.4,
            "Inovação Sustentável": 2.5
          }
        }
      },
      completedAt: new Date(2024, 2, 15),
      totalQuestions: 80,
      answeredQuestions: 80
    },
    companyData: {
      nome: "TechCorp Ltda",
      setor: "Tecnologia",
      funcionarios: "50-100"
    },
    recommendations: [
      "Implementar política formal de mudanças climáticas",
      "Desenvolver programa de engajamento com stakeholders",
      "Estabelecer metas de redução de emissões de GEE",
      "Criar comitê de sustentabilidade corporativa"
    ],
    keyInsights: [
      "Empresa em transição para práticas ESG estratégicas",
      "Forte desempenho em capital humano e satisfação dos colaboradores",
      "Necessidade de maior foco em questões ambientais",
      "Governança ESG emergente com potencial de crescimento"
    ],
    nextSteps: [
      "Elaboração de matriz de materialidade ESG",
      "Implementação de sistema de gestão ambiental",
      "Desenvolvimento de relatório de sustentabilidade",
      "Treinamento em ESG para liderança e gestores"
    ]
  },
  {
    id: "esg-assessment-2024-09",
    timestamp: new Date(2024, 8, 20), // September 2024
    period: "Set/2024",
    analyst: "Prof. Roberto Fernandes",
    analystInitials: "RF",
    status: 'completed',
    result: {
      overallScore: 3.4,
      maturityLevel: {
        level: 3,
        name: "Estratégico",
        description: "ESG como oportunidade de negócio, com metas e indicadores",
        color: "bg-yellow-500"
      },
      pillarScores: {
        environmental: {
          title: "Ambiental",
          score: 3.1,
          maxScore: 6,
          percentage: 51.7,
          maturityLevel: 3,
          questions: 25,
          subDimensions: {
            "Mudanças Climáticas": 3.0,
            "Gestão de Recursos Naturais": 3.3,
            "Biodiversidade e Ecossistemas": 2.8,
            "Gestão de Resíduos e Poluição": 3.2
          }
        },
        social: {
          title: "Social",
          score: 3.8,
          maxScore: 6,
          percentage: 63.3,
          maturityLevel: 4,
          questions: 25,
          subDimensions: {
            "Capital Humano": 4.1,
            "Relações com a Comunidade": 3.4,
            "Direitos Humanos": 3.6,
            "Responsabilidade com o Cliente": 4.0
          }
        },
        governance: {
          title: "Governança",
          score: 3.4,
          maxScore: 6,
          percentage: 56.7,
          maturityLevel: 3,
          questions: 20,
          subDimensions: {
            "Estrutura de Governança ESG": 3.6,
            "Ética e Conduta Empresarial": 3.3,
            "Gestão de Riscos ESG": 3.2,
            "Transparência e Relato": 3.5
          }
        },
        strategy: {
          title: "Estratégia",
          score: 3.2,
          maxScore: 6,
          percentage: 53.3,
          maturityLevel: 3,
          questions: 10,
          subDimensions: {
            "Integração ESG na Estratégia": 3.4,
            "Stakeholder Engagement": 3.0,
            "Inovação Sustentável": 3.1
          }
        }
      },
      completedAt: new Date(2024, 8, 20),
      totalQuestions: 80,
      answeredQuestions: 80
    },
    companyData: {
      nome: "TechCorp Ltda",
      setor: "Tecnologia",
      funcionarios: "100-250"
    },
    recommendations: [
      "Expandir iniciativas de economia circular",
      "Implementar programa de diversidade e inclusão",
      "Desenvolver métricas de impacto social",
      "Estabelecer parcerias para inovação sustentável"
    ],
    keyInsights: [
      "Evolução significativa em todas as dimensões ESG",
      "Excelência em práticas de capital humano e cultura organizacional",
      "Melhoria notável em transparência e governança ESG",
      "Crescimento sustentável alinhado com práticas ESG"
    ],
    nextSteps: [
      "Implementação de dashboard ESG integrado",
      "Certificação em padrões internacionais de sustentabilidade",
      "Desenvolvimento de produtos/serviços ESG",
      "Expansão do programa de responsabilidade social"
    ]
  },
  {
    id: "esg-assessment-2025-01",
    timestamp: new Date(2025, 0, 25), // January 2025
    period: "Jan/2025",
    analyst: "Dra. Mariana Oliveira",
    analystInitials: "MO",
    status: 'completed',
    result: {
      overallScore: 4.1,
      maturityLevel: {
        level: 4,
        name: "Inclusivo",
        description: "Visão sistêmica, com engajamento de stakeholders",
        color: "bg-blue-500"
      },
      pillarScores: {
        environmental: {
          title: "Ambiental",
          score: 3.8,
          maxScore: 6,
          percentage: 63.3,
          maturityLevel: 4,
          questions: 25,
          subDimensions: {
            "Mudanças Climáticas": 4.0,
            "Gestão de Recursos Naturais": 3.9,
            "Biodiversidade e Ecossistemas": 3.5,
            "Gestão de Resíduos e Poluição": 3.8
          }
        },
        social: {
          title: "Social",
          score: 4.3,
          maxScore: 6,
          percentage: 71.7,
          maturityLevel: 4,
          questions: 25,
          subDimensions: {
            "Capital Humano": 4.6,
            "Relações com a Comunidade": 4.0,
            "Direitos Humanos": 4.1,
            "Responsabilidade com o Cliente": 4.5
          }
        },
        governance: {
          title: "Governança",
          score: 4.0,
          maxScore: 6,
          percentage: 66.7,
          maturityLevel: 4,
          questions: 20,
          subDimensions: {
            "Estrutura de Governança ESG": 4.2,
            "Ética e Conduta Empresarial": 3.9,
            "Gestão de Riscos ESG": 3.8,
            "Transparência e Relato": 4.1
          }
        },
        strategy: {
          title: "Estratégia",
          score: 4.2,
          maxScore: 6,
          percentage: 70.0,
          maturityLevel: 4,
          questions: 10,
          subDimensions: {
            "Integração ESG na Estratégia": 4.4,
            "Stakeholder Engagement": 4.0,
            "Inovação Sustentável": 4.1
          }
        }
      },
      completedAt: new Date(2025, 0, 25),
      totalQuestions: 80,
      answeredQuestions: 80
    },
    companyData: {
      nome: "TechCorp Ltda",
      setor: "Tecnologia",
      funcionarios: "250-500"
    },
    recommendations: [
      "Implementar estratégia de net-zero para 2030",
      "Desenvolver programa de fornecedores sustentáveis",
      "Criar centro de inovação em sustentabilidade",
      "Estabelecer fundo de investimento em impacto social"
    ],
    keyInsights: [
      "Referência setorial em práticas ESG integradas",
      "Liderança reconhecida em sustentabilidade corporativa",
      "Cultura organizacional ESG consolidada",
      "Modelo de negócio regenerativo em desenvolvimento"
    ],
    nextSteps: [
      "Certificação B Corp ou similar",
      "Implementação de tecnologias ESG avançadas (AI/IoT)",
      "Expansão internacional com framework ESG robusto",
      "Desenvolvimento de ecossistema de parceiros ESG"
    ]
  }
];

export const getESGHistoricalTrend = () => {
  return mockESGAssessments.map(assessment => ({
    period: assessment.period,
    score: assessment.result.overallScore,
    maturityLevel: assessment.result.maturityLevel.name,
    environmental: assessment.result.pillarScores.environmental.score,
    social: assessment.result.pillarScores.social.score,
    governance: assessment.result.pillarScores.governance.score,
    strategy: assessment.result.pillarScores.strategy.score
  }));
};

export const getESGPillarEvolution = () => {
  const pillars = ['environmental', 'social', 'governance', 'strategy'];
  
  return pillars.map(pillar => {
    const evolution = mockESGAssessments.map(assessment => ({
      period: assessment.period,
      score: assessment.result.pillarScores[pillar as keyof typeof assessment.result.pillarScores].score,
      percentage: assessment.result.pillarScores[pillar as keyof typeof assessment.result.pillarScores].percentage
    }));
    
    return {
      pillar,
      evolution
    };
  });
};

export const getLatestESGAssessment = () => {
  return mockESGAssessments[mockESGAssessments.length - 1] || null;
};