import { esgQuestions, maturityLevels, pillarInfo } from "@/data/esgMaturityData";
import { ESGUserAnswers, ESGMaturityResult, ESGPillarResult, ESGRecommendation } from "@/types/esgMaturity";
import { mockESGAssessments, getLatestESGAssessment } from "@/data/mockESGHistoricalData";

export const calculateESGMaturity = (answers: ESGUserAnswers): ESGMaturityResult => {
  const pillarScores: any = {};
  
  // Calculate scores for each pillar
  Object.keys(pillarInfo).forEach(pillarKey => {
    const pillarQuestions = esgQuestions.filter(q => q.pillar === pillarKey);
    const pillarAnswers = pillarQuestions
      .map(q => answers[q.id])
      .filter(answer => answer !== undefined);
    
    if (pillarAnswers.length === 0) {
      pillarScores[pillarKey] = {
        title: pillarInfo[pillarKey as keyof typeof pillarInfo].title,
        score: 0,
        maxScore: 6,
        percentage: 0,
        maturityLevel: 1,
        questions: pillarQuestions.length,
        subDimensions: {}
      };
      return;
    }
    
    const averageScore = pillarAnswers.reduce((sum, score) => sum + score, 0) / pillarAnswers.length;
    const percentage = (averageScore / 6) * 100;
    const maturityLevel = Math.ceil(averageScore);
    
    // Calculate subdimension scores
    const subDimensions: { [key: string]: number } = {};
    const uniqueSubDimensions = [...new Set(pillarQuestions.map(q => q.subDimension))];
    
    uniqueSubDimensions.forEach(subDim => {
      const subDimQuestions = pillarQuestions.filter(q => q.subDimension === subDim);
      const subDimAnswers = subDimQuestions
        .map(q => answers[q.id])
        .filter(answer => answer !== undefined);
      
      if (subDimAnswers.length > 0) {
        subDimensions[subDim] = subDimAnswers.reduce((sum, score) => sum + score, 0) / subDimAnswers.length;
      }
    });
    
    pillarScores[pillarKey] = {
      title: pillarInfo[pillarKey as keyof typeof pillarInfo].title,
      score: Number(averageScore.toFixed(2)),
      maxScore: 6,
      percentage: Number(percentage.toFixed(1)),
      maturityLevel,
      questions: pillarQuestions.length,
      subDimensions
    };
  });
  
  // Calculate overall score using weighted average
  const overallScore = Object.keys(pillarInfo).reduce((sum, pillarKey) => {
    const weight = pillarInfo[pillarKey as keyof typeof pillarInfo].weight;
    return sum + (pillarScores[pillarKey].score * weight);
  }, 0);
  
  // Determine overall maturity level
  const overallMaturityLevel = maturityLevels.find(level => {
    return overallScore >= level.score - 0.5 && overallScore < level.score + 0.5;
  }) || maturityLevels[Math.ceil(overallScore) - 1] || maturityLevels[0];
  
  const totalQuestions = esgQuestions.length;
  const answeredQuestions = Object.keys(answers).length;
  
  return {
    overallScore: Number(overallScore.toFixed(2)),
    maturityLevel: overallMaturityLevel,
    pillarScores,
    completedAt: new Date(),
    totalQuestions,
    answeredQuestions
  };
};

export const generateESGRecommendations = (result: ESGMaturityResult): ESGRecommendation[] => {
  const recommendations: ESGRecommendation[] = [];
  
  Object.entries(result.pillarScores).forEach(([pillarKey, pillarData]) => {
    if (pillarData.score < 3) {
      recommendations.push({
        pillar: pillarData.title,
        priority: 'Alta',
        action: `Desenvolver estratégia estruturada para ${pillarData.title.toLowerCase().replace(/[🌱👥⚖️🎯]/g, '').trim()}`,
        impact: 'Alto impacto na maturidade geral ESG',
        currentScore: pillarData.score,
        targetScore: 3.5
      });
    } else if (pillarData.score < 4) {
      recommendations.push({
        pillar: pillarData.title,
        priority: 'Média',
        action: `Expandir e integrar iniciativas em ${pillarData.title.toLowerCase().replace(/[🌱👥⚖️🎯]/g, '').trim()}`,
        impact: 'Médio impacto na maturidade geral ESG',
        currentScore: pillarData.score,
        targetScore: 4.5
      });
    } else if (pillarData.score < 5) {
      recommendations.push({
        pillar: pillarData.title,
        priority: 'Baixa',
        action: `Otimizar e liderar práticas avançadas em ${pillarData.title.toLowerCase().replace(/[🌱👥⚖️🎯]/g, '').trim()}`,
        impact: 'Baixo impacto na maturidade geral ESG',
        currentScore: pillarData.score,
        targetScore: 5.5
      });
    }
  });
  
  // Sort by priority (Alta -> Média -> Baixa) and current score (lowest first)
  return recommendations
    .sort((a, b) => {
      const priorityOrder = { 'Alta': 3, 'Média': 2, 'Baixa': 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return a.currentScore - b.currentScore;
    })
    .slice(0, 5); // Return top 5 recommendations
};

export const saveESGAssessment = (answers: ESGUserAnswers, result: ESGMaturityResult): string => {
  const assessmentId = `esg_assessment_${Date.now()}`;
  const assessment = {
    id: assessmentId,
    timestamp: new Date(),
    answers,
    result
  };
  
  // Save to localStorage
  const existingAssessments = JSON.parse(localStorage.getItem('esg_assessments') || '[]');
  existingAssessments.unshift(assessment);
  
  // Keep only last 10 assessments
  if (existingAssessments.length > 10) {
    existingAssessments.splice(10);
  }
  
  localStorage.setItem('esg_assessments', JSON.stringify(existingAssessments));
  localStorage.setItem('latest_esg_assessment', JSON.stringify(assessment));
  
  return assessmentId;
};

export const loadESGAssessmentHistory = () => {
  try {
    const realHistory = JSON.parse(localStorage.getItem('esg_assessments') || '[]');
    if (realHistory.length > 0) {
      return realHistory;
    }
    // If no real history, return mock data
    return mockESGAssessments;
  } catch {
    // Fallback to mock data if there's any error
    return mockESGAssessments;
  }
};

export const loadLatestESGAssessment = () => {
  try {
    const realLatest = JSON.parse(localStorage.getItem('latest_esg_assessment') || 'null');
    if (realLatest) {
      return realLatest;
    }
    // If no real assessment, return latest mock data
    return getLatestESGAssessment();
  } catch {
    // Fallback to latest mock data if there's any error
    return getLatestESGAssessment();
  }
};
