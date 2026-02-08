// lib/behavior-analyzer.ts
import { Trade } from './type';

interface AnalysisResult {
  emotionalScore: number;
  rationalScore: number;
  dominantBias: 'overtrading' | 'loss_aversion' | 'revenge' | 'mixed';
  emotionalTrades: Trade[];
  rationalTrades: Trade[];
  marketCondition: string;
  durationMinutes: number;
  sessionNumber: number;
  summary: string;
}

export function analyzeTraderBehavior(trades: Trade[]): AnalysisResult {
  const emotionalTrades = trades.filter(t => t.type === 'Emotional');
  const rationalTrades = trades.filter(t => t.type === 'Rational');

  // Calculate emotional score (0-100)
  const emotionalRatio = emotionalTrades.length / trades.length;
  const avgEmotionalLoss = emotionalTrades.reduce((sum, t) => sum + (t.profit < 0 ? Math.abs(t.profit) : 0), 0) / emotionalTrades.length || 0;
  const emotionalScore = Math.min(100, emotionalRatio * 100 + avgEmotionalLoss / 10);

  // Calculate rational score (0-100)
  const rationalRatio = rationalTrades.length / trades.length;
  const avgRationalProfit = rationalTrades.reduce((sum, t) => sum + (t.profit > 0 ? t.profit : 0), 0) / rationalTrades.length || 0;
  const rationalScore = Math.min(100, rationalRatio * 100 + avgRationalProfit / 10);

  // Determine dominant bias
  const biases = {
    overtrading: 0,
    loss_aversion: 0,
    revenge: 0,
  };

  emotionalTrades.forEach(trade => {
    if (trade.reason.toLowerCase().includes('fomo') || 
        trade.reason.toLowerCase().includes('chasing')) {
      biases.overtrading++;
    }
    if (trade.reason.toLowerCase().includes('panic') || 
        trade.reason.toLowerCase().includes('fear')) {
      biases.loss_aversion++;
    }
    if (trade.reason.toLowerCase().includes('revenge')) {
      biases.revenge++;
    }
  });

  const maxBias = Math.max(biases.overtrading, biases.loss_aversion, biases.revenge);
  let dominantBias: 'overtrading' | 'loss_aversion' | 'revenge' | 'mixed';

  if (maxBias === 0 || (biases.overtrading === biases.loss_aversion && biases.overtrading === biases.revenge)) {
    dominantBias = 'mixed';
  } else if (maxBias === biases.overtrading) {
    dominantBias = 'overtrading';
  } else if (maxBias === biases.loss_aversion) {
    dominantBias = 'loss_aversion';
  } else {
    dominantBias = 'revenge';
  }

  // Market condition (simplified)
  const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
  const marketCondition = totalProfit > 0 ? 'bullish' : totalProfit < -200 ? 'bearish' : 'volatile';

  // Duration (mock - would come from actual session timing)
  const durationMinutes = trades.length * 5; // Assume 5 min per trade

  const summary = `${emotionalTrades.length} emotional trades, ${rationalTrades.length} rational trades. Bias: ${dominantBias}`;

  return {
    emotionalScore,
    rationalScore,
    dominantBias,
    emotionalTrades,
    rationalTrades,
    marketCondition,
    durationMinutes,
    sessionNumber: 1, // This would increment based on history
    summary,
  };
}