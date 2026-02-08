// lib/snowflake-client.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BehavioralSnapshot, EvolutionDataPoint } from './type';

class SnowflakeClient {
  private accountUrl: string;
  private accessToken: string;

  constructor() {
    this.accountUrl = process.env.EXPO_PUBLIC_SNOWFLAKE_ACCOUNT_URL || '';
    this.accessToken = process.env.EXPO_PUBLIC_SNOWFLAKE_ACCESS_TOKEN || '';
  }

  // Simple hash function for user ID privacy (no external dependencies needed)
  private hashUserId(userId: string): string {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // Insert behavioral snapshot
  async insertSnapshot(
    userId: string,
    snapshot: Omit<BehavioralSnapshot, 'trader_hash'>
  ): Promise<{ success: boolean; error?: string }> {
    const trader_hash = this.hashUserId(userId);

    console.log('📊 Saving behavioral snapshot:', {
      trader_hash,
      emotional_score: snapshot.emotional_self_score,
      rational_score: snapshot.rational_self_score,
      discipline_delta: snapshot.discipline_delta,
      dominant_bias: snapshot.dominant_bias
    });

    // For hackathon demo, store locally in AsyncStorage
    if (!this.accountUrl || !this.accessToken) {
      return this.storeLocally(trader_hash, snapshot);
    }

    // If Snowflake is configured, use REST API
    const sql = `
      INSERT INTO MARKET_MIRROR.PUBLIC.BEHAVIORAL_SNAPSHOTS
      (
        SESSION_ID, TRADER_HASH, SNAPSHOT_TIMESTAMP,
        EMOTIONAL_SELF_SCORE, RATIONAL_SELF_SCORE, DISCIPLINE_DELTA,
        DOMINANT_BIAS, TRADE_COUNT_EMOTIONAL, TRADE_COUNT_RATIONAL,
        MARKET_CONDITION, SESSION_DURATION_MINUTES, NOTES, APP_VERSION
      )
      VALUES
      (
        '${snapshot.session_id}', '${trader_hash}', '${snapshot.timestamp}',
        ${snapshot.emotional_self_score}, ${snapshot.rational_self_score}, ${snapshot.discipline_delta},
        '${snapshot.dominant_bias}', ${snapshot.trade_count_emotional}, ${snapshot.trade_count_rational},
        ${snapshot.market_condition ? `'${snapshot.market_condition}'` : 'NULL'},
        ${snapshot.session_duration_minutes || 'NULL'},
        ${snapshot.notes ? `'${snapshot.notes.replace(/'/g, "''")}'` : 'NULL'},
        '1.0.0'
      )
    `;

    try {
      const response = await fetch(`${this.accountUrl}/api/v2/statements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({
          statement: sql,
          timeout: 60,
          database: 'MARKET_MIRROR',
          schema: 'PUBLIC',
          warehouse: 'COMPUTE_WH'
        })
      });

      if (!response.ok) {
        throw new Error(`Snowflake API error: ${response.statusText}`);
      }

      console.log('✅ Snapshot saved to Snowflake');
      return { success: true };
    } catch (error) {
      console.error('❌ Snowflake insert error:', error);
      return { success: false, error: String(error) };
    }
  }

  // Store locally for demo
  private async storeLocally(
    trader_hash: string,
    snapshot: BehavioralSnapshot
  ): Promise<{ success: boolean }> {
    try {
      // Get existing snapshots
      const existing = await AsyncStorage.getItem('behavioral_snapshots');
      const snapshots = existing ? JSON.parse(existing) : [];
      
      // Add new snapshot with trader_hash
      snapshots.push({ ...snapshot, trader_hash });
      
      // Save back
      await AsyncStorage.setItem('behavioral_snapshots', JSON.stringify(snapshots));
      
      console.log('✅ Snapshot saved locally');
      return { success: true };
    } catch (error) {
      console.error('❌ Local storage error:', error);
      return { success: false };
    }
  }

  // Fetch trader evolution data
  async getTraderEvolution(userId: string): Promise<EvolutionDataPoint[]> {
    const trader_hash = this.hashUserId(userId);

    if (!this.accountUrl || !this.accessToken) {
      return this.getLocalEvolutionData(trader_hash);
    }

    const sql = `
      SELECT 
        SESSION_NUMBER, SNAPSHOT_TIMESTAMP, EMOTIONAL_SELF_SCORE,
        RATIONAL_SELF_SCORE, DISCIPLINE_DELTA, DISCIPLINE_IMPROVEMENT, DOMINANT_BIAS
      FROM MARKET_MIRROR.PUBLIC.TRADER_EVOLUTION
      WHERE TRADER_HASH = '${trader_hash}'
      ORDER BY SNAPSHOT_TIMESTAMP DESC
      LIMIT 30
    `;

    try {
      const response = await fetch(`${this.accountUrl}/api/v2/statements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify({
          statement: sql,
          database: 'MARKET_MIRROR',
          schema: 'PUBLIC',
          warehouse: 'COMPUTE_WH'
        })
      });

      const result = await response.json();
      return this.parseSnowflakeResults(result);
    } catch (error) {
      console.error('Snowflake fetch error:', error);
      return this.getLocalEvolutionData(trader_hash);
    }
  }

  private async getLocalEvolutionData(trader_hash: string): Promise<EvolutionDataPoint[]> {
    try {
      const existing = await AsyncStorage.getItem('behavioral_snapshots');
      const snapshots = existing ? JSON.parse(existing) : [];
      
      // Filter by trader and convert to evolution format
      const traderSnapshots = snapshots.filter((s: any) => s.trader_hash === trader_hash);
      
      return traderSnapshots.map((s: any, index: number) => ({
        session_number: index + 1,
        timestamp: s.timestamp,
        emotional_score: s.emotional_self_score,
        rational_score: s.rational_self_score,
        discipline_delta: s.discipline_delta,
        discipline_improvement: index > 0 ? s.discipline_delta - traderSnapshots[index - 1].discipline_delta : null,
        dominant_bias: s.dominant_bias
      }));
    } catch (error) {
      console.error('Error reading local data:', error);
      return [];
    }
  }

  private parseSnowflakeResults(result: any): EvolutionDataPoint[] {
    return result.data?.map((row: any[]) => ({
      session_number: row[0],
      timestamp: row[1],
      emotional_score: row[2],
      rational_score: row[3],
      discipline_delta: row[4],
      discipline_improvement: row[5],
      dominant_bias: row[6]
    })) || [];
  }
}

export const snowflake = new SnowflakeClient();