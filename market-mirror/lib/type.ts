// lib/types.ts

export interface Trade {
  time: string;
  action: 'BUY' | 'SELL';
  reason: string;
  profit: number;
  type: 'Emotional' | 'Rational';
  ticker: string;
}

export interface BehavioralSnapshot {
  session_id: string;
  timestamp: string;
  emotional_self_score: number;
  rational_self_score: number;
  discipline_delta: number;
  dominant_bias: 'overtrading' | 'loss_aversion' | 'revenge' | 'mixed';
  trade_count_emotional: number;
  trade_count_rational: number;
  market_condition?: string;
  session_duration_minutes?: number;
  notes?: string;
}

export interface TraderInsights {
  trader_profile: {
    total_sessions: number;
    avg_discipline_delta: number;
    dominant_profile: 'emotional' | 'rational' | 'balanced';
    improvement_trend: 'improving' | 'declining' | 'stable';
  };
  recent_behavior: {
    last_7_days_discipline: number;
    bias_distribution: {
      overtrading: number;
      loss_aversion: number;
      revenge: number;
      mixed: number;
    };
    emotional_trade_ratio: number;
  };
  evolution_metrics: {
    discipline_improvement: number;
    consistency_score: number;
    behavioral_drift: boolean;
  };
}

export interface EvolutionDataPoint {
  session_number: number;
  timestamp: string;
  emotional_score: number;
  rational_score: number;
  discipline_delta: number;
  discipline_improvement: number | null;
  dominant_bias: string;
}