import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';

type Result = {
  emotional: { trades: number; pnl: number };
  rational: { trades: number; pnl: number };
};

export default function HomeScreen() {
  const [result, setResult] = useState<Result | null>(null);

  const replayTradingDay = () => {
    // Mock simulation for demo
    setResult({
      emotional: { trades: 6, pnl: -420 },
      rational: { trades: 2, pnl: 480 },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🪞 Market Mirror</Text>
      <Text style={styles.subtitle}>
        The market didn’t beat you.{'\n'}You beat yourself.
      </Text>

      <Pressable style={styles.button} onPress={replayTradingDay}>
        <Text style={styles.buttonText}>Replay My Trading Day</Text>
      </Pressable>

      {result && (
        <View style={styles.card}>
          <Text style={styles.section}>😤 Emotional You</Text>
          <Text style={styles.text}>Trades: {result.emotional.trades}</Text>
          <Text style={styles.text}>P&L: ${result.emotional.pnl}</Text>

          <Text style={styles.section}>🧠 Rational You</Text>
          <Text style={styles.text}>Trades: {result.rational.trades}</Text>
          <Text style={styles.text}>P&L: ${result.rational.pnl}</Text>

          <Text style={styles.loss}>You lost to yourself.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: 'center' },
  title: { fontSize: 34, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 28, opacity: 0.8 },
  button: { backgroundColor: '#000', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16 },
  card: { marginTop: 32, width: '100%', padding: 20, backgroundColor: '#111', borderRadius: 10 },
  section: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 12 },
  text: { color: '#ccc', marginTop: 4 },
  loss: { marginTop: 20, textAlign: 'center', color: '#ff4444', fontSize: 16, fontWeight: 'bold' },
});