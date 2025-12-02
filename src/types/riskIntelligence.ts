export interface MarketThreat {
  id: string;
  title: string;
  description: string;
  source: 'regulatory' | 'market' | 'competitive' | 'technological' | 'economic' | 'esg';
  impact: 1 | 2 | 3 | 4 | 5;
  probability: 1 | 2 | 3 | 4 | 5;
  timeHorizon: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  suggestedActions: string[];
  relatedCompetitors?: string[];
}

export interface MarketOpportunity {
  id: string;
  title: string;
  description: string;
  source: 'market_gap' | 'trend' | 'regulation' | 'technology' | 'partnership';
  potentialValue: 'high' | 'medium' | 'low';
  timeWindow: string;
  requirements: string[];
  estimatedImpact?: string;
}

export interface AgendaSuggestion {
  id: string;
  title: string;
  description: string;
  relatedInsightId: string;
  relatedInsightType: 'threat' | 'opportunity';
  suggestedOrgan: 'conselho' | 'comite' | 'comissao';
  organName: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  discussionPoints: string[];
}

export interface CompetitorInsight {
  id: string;
  name: string;
  recentMove: string;
  threatLevel: 'high' | 'medium' | 'low';
  opportunityFromWeakness?: string;
  marketShare?: string;
}

export interface SectorTrend {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  relevance: number; // 1-100
  source: string;
  timeframe: string;
}

export interface CompanyContext {
  sector: string;
  region: string;
  mainCompetitors: string[];
  companySize: 'pequena' | 'media' | 'grande';
  focusAreas: string[];
}
