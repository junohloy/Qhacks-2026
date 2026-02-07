import { View, Text, StyleSheet, ScrollView } from 'react-native';

type Trade = {
  time: string;
  action: 'BUY' | 'SELL';
  reason: string;
  profit: number;
  type: 'Emotional' | 'Rational';
};

// Example mock trades
const TRADES: Trade[] = [
  { time: '09:31', action: 'BUY', reason: 'FOMO', profit: -120, type: 'Emotional' },
  { time: '09:45', action: 'SELL', reason: 'Fear', profit: -80, type: 'Emotional' },
  { time: '10:30', action: 'BUY', reason: 'Strategy', profit: 300, type: 'Rational' },
  { time: '11:15', action: 'SELL', reason: 'Plan', profit: 180, type: 'Rational' },
];

export default function TradeReplayScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📊 Trade Replay</Text>
      {TRADES.map((trade, i) => (
        <View
          key={i}
          style={[
            styles.tradeCard,
            { backgroundColor: trade.type === 'Rational' ? '#1e3a8a' : '#991b1b' },
          ]}
        >
          <Text style={styles.tradeText}>
            {trade.time} — {trade.action} — {trade.reason} — ${trade.profit}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  tradeCard: {
    width: '100%',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  tradeText: { color: '#fff', fontWeight: 'bold' },
});