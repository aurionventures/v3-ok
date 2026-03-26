import { 
  GraduationCap, Trophy, BarChart3, Target, Heart, 
  Award, UserCheck, Clock, Users, Briefcase
} from 'lucide-react';

export interface CriterionDefinition {
  key: string;
  label: string;
  weight: number;
  icon: any;
  description?: string;
}

export const criteriaByCategory = {
  heir: [
    { 
      key: 'education', 
      label: 'Formação Acadêmica', 
      weight: 0.15, 
      icon: GraduationCap,
      description: 'Nível educacional e especializações relevantes'
    },
    { 
      key: 'leadership', 
      label: 'Experiência de Liderança', 
      weight: 0.25, 
      icon: Trophy,
      description: 'Histórico de liderança de equipes e projetos'
    },
    { 
      key: 'business', 
      label: 'Conhecimento do Negócio', 
      weight: 0.20, 
      icon: BarChart3,
      description: 'Entendimento profundo do negócio familiar'
    },
    { 
      key: 'vision', 
      label: 'Visão Estratégica', 
      weight: 0.20, 
      icon: Target,
      description: 'Capacidade de pensar estrategicamente e planejar o futuro'
    },
    { 
      key: 'family', 
      label: 'Alinhamento Familiar', 
      weight: 0.20, 
      icon: Heart,
      description: 'Alinhamento com valores e objetivos da família'
    }
  ],
  board_member: [
    { 
      key: 'governance', 
      label: 'Experiência em Governança', 
      weight: 0.30, 
      icon: Award,
      description: 'Experiência prévia em conselhos e governança corporativa'
    },
    { 
      key: 'independence', 
      label: 'Independência', 
      weight: 0.20, 
      icon: UserCheck,
      description: 'Capacidade de atuar de forma independente'
    },
    { 
      key: 'expertise', 
      label: 'Expertise Setorial', 
      weight: 0.25, 
      icon: GraduationCap,
      description: 'Conhecimento especializado no setor de atuação'
    },
    { 
      key: 'time', 
      label: 'Disponibilidade de Tempo', 
      weight: 0.15, 
      icon: Clock,
      description: 'Tempo disponível para dedicação ao conselho'
    },
    { 
      key: 'ethics', 
      label: 'Integridade e Ética', 
      weight: 0.10, 
      icon: Heart,
      description: 'Reputação e conduta ética comprovada'
    }
  ],
  key_position: [
    { 
      key: 'education', 
      label: 'Formação e Certificações', 
      weight: 0.20, 
      icon: GraduationCap,
      description: 'Formação acadêmica e certificações profissionais'
    },
    { 
      key: 'managementExp', 
      label: 'Experiência de Gestão', 
      weight: 0.25, 
      icon: Users,
      description: 'Experiência gerencial e administrativa'
    },
    { 
      key: 'leadership', 
      label: 'Liderança e Soft Skills', 
      weight: 0.20, 
      icon: Trophy,
      description: 'Habilidades de liderança e competências comportamentais'
    },
    { 
      key: 'results', 
      label: 'Resultados Entregues', 
      weight: 0.20, 
      icon: BarChart3,
      description: 'Histórico de entrega de resultados concretos'
    },
    { 
      key: 'culturalFit', 
      label: 'Alinhamento Cultural', 
      weight: 0.15, 
      icon: Heart,
      description: 'Fit cultural com a organização'
    }
  ],
  development: [
    { 
      key: 'currentSkills', 
      label: 'Competências Atuais', 
      weight: 0.20, 
      icon: GraduationCap,
      description: 'Competências e habilidades já desenvolvidas'
    },
    { 
      key: 'targetSkills', 
      label: 'Competências Necessárias', 
      weight: 0.25, 
      icon: Target,
      description: 'Competências requeridas para o cargo alvo'
    },
    { 
      key: 'experience', 
      label: 'Experiência Relevante', 
      weight: 0.20, 
      icon: Briefcase,
      description: 'Experiência profissional relevante para o desenvolvimento'
    },
    { 
      key: 'motivation', 
      label: 'Motivação e Engajamento', 
      weight: 0.15, 
      icon: Heart,
      description: 'Nível de motivação e comprometimento com o desenvolvimento'
    },
    { 
      key: 'timeAvailability', 
      label: 'Disponibilidade de Tempo', 
      weight: 0.20, 
      icon: Clock,
      description: 'Tempo disponível para dedicação ao plano de desenvolvimento'
    }
  ]
};
