export interface ESGUserAnswers {
  [questionId: string]: number;
}

export interface ESGPillarResult {
  title: string;
  score: number;
  maxScore: number;
  percentage: number;
  maturityLevel: number;
  questions: number;
  subDimensions: { [key: string]: number };
}

export interface ESGMaturityResult {
  overallScore: number;
  maturityLevel: {
    level: number;
    name: string;
    description: string;
    color: string;
  };
  pillarScores: {
    environmental: ESGPillarResult;
    social: ESGPillarResult;
    governance: ESGPillarResult;
    strategy: ESGPillarResult;
  };
  completedAt: Date;
  totalQuestions: number;
  answeredQuestions: number;
}

export interface ESGRecommendation {
  pillar: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  action: string;
  impact: string;
  currentScore: number;
  targetScore: number;
}

export interface ESGAssessmentHistory {
  id: string;
  timestamp: Date;
  result: ESGMaturityResult;
  answers: ESGUserAnswers;
}