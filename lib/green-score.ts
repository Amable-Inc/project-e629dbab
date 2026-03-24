import { supabase, RiskLog, Plot } from './supabase';

/**
 * GREEN CREDIT SCORE ALGORITHM
 * Calcula el puntaje de resiliencia climática y elegibilidad crediticia
 * basado en las prácticas preventivas del agricultor
 */

interface GreenScoreParams {
  farmerId: string;
}

interface GreenScoreResult {
  score: number; // 0-100
  riskLevel: 'bajo' | 'medio' | 'alto';
  climateResilienceScore: number;
  financialCommitmentScore: number;
  preventionActionsCount: number;
  avgNdvi: number;
  certifiedSeedsPercentage: number;
  daysSinceLastReport: number;
  totalPlots: number;
  totalHectares: number;
  calculationDetails: Record<string, any>;
}

/**
 * Calcula el Green Credit Score para un agricultor
 */
export async function calculateGreenScore(
  params: GreenScoreParams
): Promise<GreenScoreResult> {
  const { farmerId } = params;

  // 1. Obtener todas las parcelas del agricultor
  const { data: plots, error: plotsError } = await supabase
    .from('plots')
    .select('*')
    .eq('farmer_id', farmerId);

  if (plotsError) throw new Error('Error fetching plots');

  const totalPlots = plots?.length || 0;
  const totalHectares = plots?.reduce((sum, plot) => sum + Number(plot.hectares), 0) || 0;
  
  // Calcular % de parcelas con semillas certificadas
  const certifiedPlotsCount = plots?.filter(p => p.certified_seeds).length || 0;
  const certifiedSeedsPercentage = totalPlots > 0 
    ? (certifiedPlotsCount / totalPlots) * 100 
    : 0;

  // 2. Obtener todos los registros de mitigación (últimos 6 meses)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: riskLogs, error: logsError } = await supabase
    .from('risk_logs')
    .select('*')
    .eq('farmer_id', farmerId)
    .gte('logged_at', sixMonthsAgo.toISOString())
    .order('logged_at', { ascending: false });

  if (logsError) throw new Error('Error fetching risk logs');

  const preventionActionsCount = riskLogs?.length || 0;

  // 3. Calcular promedio NDVI (salud del cultivo)
  const ndviValues = riskLogs?.filter(log => log.ndvi_index !== null).map(log => log.ndvi_index) || [];
  const avgNdvi = ndviValues.length > 0
    ? ndviValues.reduce((sum, val) => sum + Number(val), 0) / ndviValues.length
    : 0;

  // 4. Días desde el último reporte
  const lastReport = riskLogs?.[0];
  const daysSinceLastReport = lastReport
    ? Math.floor((Date.now() - new Date(lastReport.logged_at).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  // 5. Calcular inversión total en prevención
  const totalInvestment = riskLogs?.reduce((sum, log) => sum + (Number(log.cost) || 0), 0) || 0;

  // ========================================
  // CÁLCULO DEL SCORE
  // ========================================

  // A. Climate Resilience Score (0-50 puntos)
  let climateResilienceScore = 0;

  // A1. Frecuencia de reportes (0-15 pts)
  if (preventionActionsCount >= 12) climateResilienceScore += 15;
  else if (preventionActionsCount >= 8) climateResilienceScore += 12;
  else if (preventionActionsCount >= 4) climateResilienceScore += 8;
  else if (preventionActionsCount >= 2) climateResilienceScore += 4;

  // A2. NDVI promedio - Salud del cultivo (0-20 pts)
  if (avgNdvi >= 0.7) climateResilienceScore += 20;
  else if (avgNdvi >= 0.5) climateResilienceScore += 15;
  else if (avgNdvi >= 0.3) climateResilienceScore += 10;
  else if (avgNdvi > 0) climateResilienceScore += 5;

  // A3. Semillas certificadas (0-15 pts)
  if (certifiedSeedsPercentage >= 80) climateResilienceScore += 15;
  else if (certifiedSeedsPercentage >= 50) climateResilienceScore += 10;
  else if (certifiedSeedsPercentage >= 25) climateResilienceScore += 5;

  // B. Financial Commitment Score (0-30 puntos)
  let financialCommitmentScore = 0;

  // B1. Inversión en prevención (0-20 pts)
  if (totalInvestment >= 2000000) financialCommitmentScore += 20; // $2M COP
  else if (totalInvestment >= 1000000) financialCommitmentScore += 15;
  else if (totalInvestment >= 500000) financialCommitmentScore += 10;
  else if (totalInvestment > 0) financialCommitmentScore += 5;

  // B2. Diversidad de acciones preventivas (0-10 pts)
  const uniqueLogTypes = new Set(riskLogs?.map(log => log.log_type) || []).size;
  if (uniqueLogTypes >= 3) financialCommitmentScore += 10;
  else if (uniqueLogTypes >= 2) financialCommitmentScore += 7;
  else if (uniqueLogTypes >= 1) financialCommitmentScore += 4;

  // C. Consistency Score (0-20 puntos)
  let consistencyScore = 0;

  // C1. Días desde el último reporte (0-10 pts)
  if (daysSinceLastReport <= 7) consistencyScore += 10;
  else if (daysSinceLastReport <= 15) consistencyScore += 7;
  else if (daysSinceLastReport <= 30) consistencyScore += 5;
  else if (daysSinceLastReport <= 60) consistencyScore += 2;

  // C2. Extensión de cultivo monitoreado (0-10 pts)
  if (totalHectares >= 10) consistencyScore += 10;
  else if (totalHectares >= 5) consistencyScore += 7;
  else if (totalHectares >= 2) consistencyScore += 5;
  else if (totalHectares > 0) consistencyScore += 2;

  // SCORE FINAL (0-100)
  const finalScore = Math.min(
    100,
    climateResilienceScore + financialCommitmentScore + consistencyScore
  );

  // Determinar nivel de riesgo
  let riskLevel: 'bajo' | 'medio' | 'alto';
  if (finalScore >= 70) riskLevel = 'bajo';
  else if (finalScore >= 40) riskLevel = 'medio';
  else riskLevel = 'alto';

  // Metadata del cálculo
  const calculationDetails = {
    climateResilienceBreakdown: {
      reportFrequency: preventionActionsCount >= 12 ? 15 : preventionActionsCount >= 8 ? 12 : preventionActionsCount >= 4 ? 8 : preventionActionsCount >= 2 ? 4 : 0,
      avgNdviScore: avgNdvi >= 0.7 ? 20 : avgNdvi >= 0.5 ? 15 : avgNdvi >= 0.3 ? 10 : avgNdvi > 0 ? 5 : 0,
      certifiedSeedsScore: certifiedSeedsPercentage >= 80 ? 15 : certifiedSeedsPercentage >= 50 ? 10 : certifiedSeedsPercentage >= 25 ? 5 : 0,
    },
    financialCommitmentBreakdown: {
      investmentScore: totalInvestment >= 2000000 ? 20 : totalInvestment >= 1000000 ? 15 : totalInvestment >= 500000 ? 10 : totalInvestment > 0 ? 5 : 0,
      diversityScore: uniqueLogTypes >= 3 ? 10 : uniqueLogTypes >= 2 ? 7 : uniqueLogTypes >= 1 ? 4 : 0,
    },
    consistencyBreakdown: {
      recencyScore: daysSinceLastReport <= 7 ? 10 : daysSinceLastReport <= 15 ? 7 : daysSinceLastReport <= 30 ? 5 : daysSinceLastReport <= 60 ? 2 : 0,
      scaleScore: totalHectares >= 10 ? 10 : totalHectares >= 5 ? 7 : totalHectares >= 2 ? 5 : totalHectares > 0 ? 2 : 0,
    },
    totalInvestment,
    uniqueActionTypes: uniqueLogTypes,
  };

  return {
    score: finalScore,
    riskLevel,
    climateResilienceScore,
    financialCommitmentScore,
    preventionActionsCount,
    avgNdvi,
    certifiedSeedsPercentage,
    daysSinceLastReport,
    totalPlots,
    totalHectares,
    calculationDetails,
  };
}

/**
 * Guarda el score calculado en la base de datos
 */
export async function saveGreenScore(
  farmerId: string,
  scoreData: GreenScoreResult
): Promise<void> {
  const validUntil = new Date();
  validUntil.setMonth(validUntil.getMonth() + 3); // Válido por 3 meses

  const { error } = await supabase.from('credit_scores').insert({
    farmer_id: farmerId,
    score: scoreData.score,
    risk_level: scoreData.riskLevel,
    total_plots: scoreData.totalPlots,
    total_hectares: scoreData.totalHectares,
    prevention_actions_count: scoreData.preventionActionsCount,
    avg_ndvi: scoreData.avgNdvi,
    certified_seeds_percentage: scoreData.certifiedSeedsPercentage,
    days_since_last_report: scoreData.daysSinceLastReport,
    climate_resilience_score: scoreData.climateResilienceScore,
    financial_commitment_score: scoreData.financialCommitmentScore,
    calculation_details: scoreData.calculationDetails,
    valid_until: validUntil.toISOString(),
  });

  if (error) throw new Error('Error saving credit score');
}
