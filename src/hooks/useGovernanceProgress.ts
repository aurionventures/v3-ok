import { useState, useEffect } from 'react';

export interface ModuleProgress {
  id: string;
  name: string;
  description: string;
  completionPercentage: number;
  isCompleted: boolean;
  weight: number;
  icon: string;
  urgency: 'high' | 'medium' | 'low';
  estimatedValue: number; // in R$
  completionCriteria: string[];
  nextActions: string[];
}

export interface GovernanceProgress {
  overallPercentage: number;
  modules: ModuleProgress[];
  completedModules: number;
  totalModules: number;
  estimatedTotalValue: number;
  nextRecommendations: string[];
  milestones: {
    name: string;
    threshold: number;
    achieved: boolean;
    reward: string;
  }[];
}

const initialModules: ModuleProgress[] = [
  {
    id: 'family-structure',
    name: 'Estrutura Societária',
    description: 'Cadastro completo da família e organograma',
    completionPercentage: 65,
    isCompleted: false,
    weight: 10,
    icon: 'Users',
    urgency: 'high',
    estimatedValue: 250000,
    completionCriteria: [
      'Cadastro de pelo menos 3 membros',
      'Definição do organograma familiar',
      'Mapeamento de 3 gerações'
    ],
    nextActions: [
      'Adicionar mais 2 membros da família',
      'Definir papéis e responsabilidades'
    ]
  },
  {
    id: 'councils',
    name: 'Conselhos',
    description: 'Estruturação dos conselhos de governança',
    completionPercentage: 30,
    isCompleted: false,
    weight: 12,
    icon: 'Shield',
    urgency: 'high',
    estimatedValue: 400000,
    completionCriteria: [
      'Criação de pelo menos 1 conselho',
      'Definição de membros e mandatos',
      'Estabelecimento de cronograma de reuniões'
    ],
    nextActions: [
      'Criar Conselho de Administração',
      'Definir membros do conselho'
    ]
  },
  {
    id: 'rituals',
    name: 'Rituais',
    description: 'Agendamento e organização de rituais familiares',
    completionPercentage: 45,
    isCompleted: false,
    weight: 8,
    icon: 'Calendar',
    urgency: 'medium',
    estimatedValue: 150000,
    completionCriteria: [
      'Agendamento de pelo menos 2 rituais',
      'Definição de frequência',
      'Estabelecimento de agenda anual'
    ],
    nextActions: [
      'Agendar próxima reunião familiar',
      'Definir cronograma anual'
    ]
  },
  {
    id: 'succession',
    name: 'Sucessão',
    description: 'Planejamento sucessório da família',
    completionPercentage: 20,
    isCompleted: false,
    weight: 15,
    icon: 'TrendingUp',
    urgency: 'high',
    estimatedValue: 600000,
    completionCriteria: [
      'Definição de critérios sucessórios',
      'Mapeamento de pelo menos 1 sucessor',
      'Plano de desenvolvimento de sucessores'
    ],
    nextActions: [
      'Estabelecer critérios de sucessão',
      'Identificar potenciais sucessores'
    ]
  },
  {
    id: 'documents',
    name: 'Documentos',
    description: 'Gestão documental e protocolo familiar',
    completionPercentage: 80,
    isCompleted: false,
    weight: 10,
    icon: 'FileText',
    urgency: 'low',
    estimatedValue: 180000,
    completionCriteria: [
      'Upload do protocolo familiar',
      'Documentação do estatuto',
      'Arquivo de documentos essenciais'
    ],
    nextActions: [
      'Revisar protocolo familiar',
      'Adicionar documentos pendentes'
    ]
  },
  {
    id: 'maturity',
    name: 'Maturidade',
    description: 'Avaliação de maturidade da governança',
    completionPercentage: 90,
    isCompleted: true,
    weight: 12,
    icon: 'BarChart3',
    urgency: 'low',
    estimatedValue: 300000,
    completionCriteria: [
      'Conclusão do quiz de maturidade',
      'Análise dos resultados',
      'Plano de melhorias'
    ],
    nextActions: []
  },
  {
    id: 'esg',
    name: 'ESG',
    description: 'Indicadores de sustentabilidade',
    completionPercentage: 35,
    isCompleted: false,
    weight: 8,
    icon: 'Leaf',
    urgency: 'medium',
    estimatedValue: 220000,
    completionCriteria: [
      'Preenchimento de indicadores básicos',
      'Definição de metas ESG',
      'Relatório de sustentabilidade'
    ],
    nextActions: [
      'Completar indicadores ambientais',
      'Definir metas de sustentabilidade'
    ]
  },
  {
    id: 'systemic-risks',
    name: 'Riscos Sistêmicos',
    description: 'Identificação e gestão de riscos',
    completionPercentage: 55,
    isCompleted: false,
    weight: 12,
    icon: 'AlertTriangle',
    urgency: 'high',
    estimatedValue: 350000,
    completionCriteria: [
      'Identificação de pelo menos 5 riscos',
      'Categorização dos riscos',
      'Planos de mitigação'
    ],
    nextActions: [
      'Categorizar riscos identificados',
      'Criar planos de mitigação'
    ]
  },
  {
    id: 'people-development',
    name: 'Desenvolvimento de Pessoas',
    description: 'Capacitação e desenvolvimento familiar',
    completionPercentage: 25,
    isCompleted: false,
    weight: 8,
    icon: 'GraduationCap',
    urgency: 'medium',
    estimatedValue: 280000,
    completionCriteria: [
      'Definição de trilhas de desenvolvimento',
      'Mapeamento de competências',
      'Programa de capacitação'
    ],
    nextActions: [
      'Mapear competências atuais',
      'Definir trilhas de desenvolvimento'
    ]
  },
  {
    id: 'subsystems',
    name: 'Subsistemas',
    description: 'Configuração de subsistemas organizacionais',
    completionPercentage: 40,
    isCompleted: false,
    weight: 6,
    icon: 'Settings',
    urgency: 'low',
    estimatedValue: 120000,
    completionCriteria: [
      'Configuração de pelo menos 3 subsistemas',
      'Integração entre sistemas',
      'Monitoramento ativo'
    ],
    nextActions: [
      'Configurar subsistemas pendentes',
      'Testar integrações'
    ]
  },
  {
    id: 'cap-table',
    name: 'Cap Table',
    description: 'Estrutura de capital e participações',
    completionPercentage: 60,
    isCompleted: false,
    weight: 10,
    icon: 'PieChart',
    urgency: 'medium',
    estimatedValue: 200000,
    completionCriteria: [
      'Definição da estrutura acionária',
      'Mapeamento de participações',
      'Documentação legal'
    ],
    nextActions: [
      'Atualizar participações',
      'Revisar documentação'
    ]
  },
  {
    id: 'ai-config',
    name: 'Configuração de IA',
    description: 'Configuração de agentes de IA',
    completionPercentage: 15,
    isCompleted: false,
    weight: 5,
    icon: 'Bot',
    urgency: 'low',
    estimatedValue: 100000,
    completionCriteria: [
      'Configuração de pelo menos 1 agente',
      'Personalização de respostas',
      'Integração com dados'
    ],
    nextActions: [
      'Configurar primeiro agente',
      'Personalizar configurações'
    ]
  },
  {
    id: 'settings',
    name: 'Configurações Gerais',
    description: 'Configurações da plataforma',
    completionPercentage: 85,
    isCompleted: false,
    weight: 4,
    icon: 'Cog',
    urgency: 'low',
    estimatedValue: 50000,
    completionCriteria: [
      'Perfil da empresa definido',
      'Preferências configuradas',
      'Notificações ativadas'
    ],
    nextActions: [
      'Revisar configurações de notificação'
    ]
  }
];

const milestones = [
  {
    name: 'Primeiros Passos',
    threshold: 25,
    achieved: false,
    reward: 'Badge de Iniciante'
  },
  {
    name: 'Meio Caminho',
    threshold: 50,
    achieved: false,
    reward: 'Relatório de Progresso Premium'
  },
  {
    name: 'Quase Lá',
    threshold: 75,
    achieved: false,
    reward: 'Consultoria Especializada'
  },
  {
    name: 'Governança Completa',
    threshold: 100,
    achieved: false,
    reward: 'Certificação de Excelência'
  }
];

export const useGovernanceProgress = (): GovernanceProgress => {
  const [modules, setModules] = useState<ModuleProgress[]>(initialModules);

  const calculateOverallProgress = () => {
    const totalWeight = modules.reduce((sum, module) => sum + module.weight, 0);
    const weightedProgress = modules.reduce(
      (sum, module) => sum + (module.completionPercentage * module.weight) / 100,
      0
    );
    return Math.round((weightedProgress / totalWeight) * 100);
  };

  const overallPercentage = calculateOverallProgress();
  const completedModules = modules.filter(module => module.isCompleted).length;
  const estimatedTotalValue = modules.reduce((sum, module) => sum + module.estimatedValue, 0);

  const nextRecommendations = modules
    .filter(module => !module.isCompleted && module.urgency === 'high')
    .slice(0, 3)
    .map(module => `Complete ${module.name}: ${module.nextActions[0]}`);

  const updatedMilestones = milestones.map(milestone => ({
    ...milestone,
    achieved: overallPercentage >= milestone.threshold
  }));

  return {
    overallPercentage,
    modules,
    completedModules,
    totalModules: modules.length,
    estimatedTotalValue,
    nextRecommendations,
    milestones: updatedMilestones
  };
};