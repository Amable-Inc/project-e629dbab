// Simulación de base de datos JSON local

import farmersData from '@/data/farmers.json';
import plotsData from '@/data/plots.json';
import riskLogsData from '@/data/risk-logs.json';
import creditScoresData from '@/data/credit-scores.json';
import bankTokensData from '@/data/bank-tokens.json';

// Types
export type Farmer = {
  id: string;
  userId: string;
  fullName: string;
  phone?: string;
  email?: string;
  documentId?: string;
  farmName?: string;
  farmAddress?: string;
  latitude?: number;
  longitude?: number;
  municipality?: string;
  department?: string;
  riskZoneLevel?: number;
  createdAt: string;
  updatedAt: string;
};

export type Plot = {
  id: string;
  farmerId: string;
  plotName: string;
  hectares: number;
  cropType: string;
  plantingDate?: string;
  expectedHarvestDate?: string;
  latitude?: number;
  longitude?: number;
  soilType?: string;
  irrigationSystem?: string;
  certifiedSeeds: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RiskLog = {
  id: string;
  plotId: string;
  farmerId: string;
  logType: 'pest_control' | 'disease_prevention' | 'climate_action';
  description: string;
  photoUrl?: string;
  severityLevel?: number;
  actionTaken?: string;
  cost?: number;
  ndviIndex?: number;
  latitude?: number;
  longitude?: number;
  loggedAt: string;
  createdAt: string;
};

export type CreditScore = {
  id: string;
  farmerId: string;
  score: number;
  riskLevel: 'bajo' | 'medio' | 'alto';
  totalPlots: number;
  totalHectares: number;
  preventionActionsCount: number;
  avgNdvi?: number;
  certifiedSeedsPercentage?: number;
  daysSinceLastReport?: number;
  climateResilienceScore?: number;
  financialCommitmentScore?: number;
  calculationDetails?: Record<string, any>;
  calculatedAt: string;
  validUntil?: string;
  createdAt: string;
};

export type BankAccessToken = {
  id: string;
  farmerId: string;
  token: string;
  bankName?: string;
  grantedAt: string;
  expiresAt?: string;
  isActive: boolean;
  accessCount: number;
  lastAccessedAt?: string;
};

// Simulated Database
class Database {
  private farmers: Farmer[] = farmersData as Farmer[];
  private plots: Plot[] = plotsData as Plot[];
  private riskLogs: RiskLog[] = riskLogsData as RiskLog[];
  private creditScores: CreditScore[] = creditScoresData as CreditScore[];
  private bankTokens: BankAccessToken[] = bankTokensData as BankAccessToken[];

  // FARMERS
  async getFarmer(id: string): Promise<Farmer | null> {
    return this.farmers.find(f => f.id === id) || null;
  }

  async getFarmerByUserId(userId: string): Promise<Farmer | null> {
    return this.farmers.find(f => f.userId === userId) || null;
  }

  async getAllFarmers(): Promise<Farmer[]> {
    return [...this.farmers];
  }

  async createFarmer(farmer: Omit<Farmer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Farmer> {
    const newFarmer: Farmer = {
      ...farmer,
      id: `farmer-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.farmers.push(newFarmer);
    return newFarmer;
  }

  // PLOTS
  async getPlotsByFarmerId(farmerId: string): Promise<Plot[]> {
    return this.plots.filter(p => p.farmerId === farmerId);
  }

  async getPlot(id: string): Promise<Plot | null> {
    return this.plots.find(p => p.id === id) || null;
  }

  async createPlot(plot: Omit<Plot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Plot> {
    const newPlot: Plot = {
      ...plot,
      id: `plot-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.plots.push(newPlot);
    return newPlot;
  }

  // RISK LOGS
  async getRiskLogsByFarmerId(farmerId: string, limit?: number): Promise<RiskLog[]> {
    const logs = this.riskLogs
      .filter(log => log.farmerId === farmerId)
      .sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime());
    
    return limit ? logs.slice(0, limit) : logs;
  }

  async getRiskLogsByPlotId(plotId: string): Promise<RiskLog[]> {
    return this.riskLogs.filter(log => log.plotId === plotId);
  }

  async createRiskLog(log: Omit<RiskLog, 'id' | 'createdAt'>): Promise<RiskLog> {
    const newLog: RiskLog = {
      ...log,
      id: `log-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.riskLogs.push(newLog);
    return newLog;
  }

  // CREDIT SCORES
  async getCreditScoreByFarmerId(farmerId: string): Promise<CreditScore | null> {
    const scores = this.creditScores
      .filter(s => s.farmerId === farmerId)
      .sort((a, b) => new Date(b.calculatedAt).getTime() - new Date(a.calculatedAt).getTime());
    
    return scores[0] || null;
  }

  async createCreditScore(score: Omit<CreditScore, 'id' | 'createdAt'>): Promise<CreditScore> {
    const newScore: CreditScore = {
      ...score,
      id: `score-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.creditScores.push(newScore);
    return newScore;
  }

  // BANK TOKENS
  async getTokensByFarmerId(farmerId: string): Promise<BankAccessToken[]> {
    return this.bankTokens.filter(t => t.farmerId === farmerId);
  }

  async getTokenByValue(token: string): Promise<BankAccessToken | null> {
    return this.bankTokens.find(t => t.token === token) || null;
  }

  async createToken(token: Omit<BankAccessToken, 'id'>): Promise<BankAccessToken> {
    const newToken: BankAccessToken = {
      ...token,
      id: `token-${Date.now()}`,
    };
    this.bankTokens.push(newToken);
    return newToken;
  }

  async updateToken(id: string, updates: Partial<BankAccessToken>): Promise<BankAccessToken | null> {
    const index = this.bankTokens.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    this.bankTokens[index] = { ...this.bankTokens[index], ...updates };
    return this.bankTokens[index];
  }

  async revokeToken(id: string): Promise<boolean> {
    const token = await this.updateToken(id, { isActive: false });
    return token !== null;
  }
}

// Singleton instance
export const db = new Database();

// Helper functions para calcular Green Score
export function calculateGreenScore(farmerId: string): CreditScore {
  const plots = plotsData.filter(p => p.farmerId === farmerId);
  const logs = riskLogsData.filter(l => l.farmerId === farmerId);

  const totalPlots = plots.length;
  const totalHectares = plots.reduce((sum, p) => sum + p.hectares, 0);
  
  const certifiedPlotsCount = plots.filter(p => p.certifiedSeeds).length;
  const certifiedSeedsPercentage = totalPlots > 0 ? (certifiedPlotsCount / totalPlots) * 100 : 0;

  const preventionActionsCount = logs.length;
  
  const ndviValues = logs.filter(l => l.ndviIndex).map(l => l.ndviIndex!);
  const avgNdvi = ndviValues.length > 0 
    ? ndviValues.reduce((sum, val) => sum + val, 0) / ndviValues.length 
    : 0;

  const lastLog = logs.sort((a, b) => 
    new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
  )[0];
  const daysSinceLastReport = lastLog
    ? Math.floor((Date.now() - new Date(lastLog.loggedAt).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  const totalInvestment = logs.reduce((sum, l) => sum + (l.cost || 0), 0);

  // Cálculo del score
  let climateResilienceScore = 0;
  if (preventionActionsCount >= 12) climateResilienceScore += 15;
  else if (preventionActionsCount >= 8) climateResilienceScore += 12;
  else if (preventionActionsCount >= 4) climateResilienceScore += 8;
  else if (preventionActionsCount >= 2) climateResilienceScore += 4;

  if (avgNdvi >= 0.7) climateResilienceScore += 20;
  else if (avgNdvi >= 0.5) climateResilienceScore += 15;
  else if (avgNdvi >= 0.3) climateResilienceScore += 10;
  else if (avgNdvi > 0) climateResilienceScore += 5;

  if (certifiedSeedsPercentage >= 80) climateResilienceScore += 15;
  else if (certifiedSeedsPercentage >= 50) climateResilienceScore += 10;
  else if (certifiedSeedsPercentage >= 25) climateResilienceScore += 5;

  let financialCommitmentScore = 0;
  if (totalInvestment >= 2000000) financialCommitmentScore += 20;
  else if (totalInvestment >= 1000000) financialCommitmentScore += 15;
  else if (totalInvestment >= 500000) financialCommitmentScore += 10;
  else if (totalInvestment > 0) financialCommitmentScore += 5;

  const uniqueLogTypes = new Set(logs.map(l => l.logType)).size;
  if (uniqueLogTypes >= 3) financialCommitmentScore += 10;
  else if (uniqueLogTypes >= 2) financialCommitmentScore += 7;
  else if (uniqueLogTypes >= 1) financialCommitmentScore += 4;

  let consistencyScore = 0;
  if (daysSinceLastReport <= 7) consistencyScore += 10;
  else if (daysSinceLastReport <= 15) consistencyScore += 7;
  else if (daysSinceLastReport <= 30) consistencyScore += 5;
  else if (daysSinceLastReport <= 60) consistencyScore += 2;

  if (totalHectares >= 10) consistencyScore += 10;
  else if (totalHectares >= 5) consistencyScore += 7;
  else if (totalHectares >= 2) consistencyScore += 5;
  else if (totalHectares > 0) consistencyScore += 2;

  const finalScore = Math.min(100, climateResilienceScore + financialCommitmentScore + consistencyScore);

  let riskLevel: 'bajo' | 'medio' | 'alto';
  if (finalScore >= 70) riskLevel = 'bajo';
  else if (finalScore >= 40) riskLevel = 'medio';
  else riskLevel = 'alto';

  return {
    id: `score-${Date.now()}`,
    farmerId,
    score: finalScore,
    riskLevel,
    totalPlots,
    totalHectares,
    preventionActionsCount,
    avgNdvi,
    certifiedSeedsPercentage,
    daysSinceLastReport,
    climateResilienceScore,
    financialCommitmentScore,
    calculationDetails: {
      totalInvestment,
      uniqueActionTypes: uniqueLogTypes,
    },
    calculatedAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };
}
