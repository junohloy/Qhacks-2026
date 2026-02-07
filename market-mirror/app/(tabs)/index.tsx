import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';

type Result = {
  emotional: { trades: number; pnl: number };
  rational: { trades: number; pnl: number };
};

export default function HomeScreen() {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (result) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [result, fadeAnim, scaleAnim]);

  const replayTradingDay = () => {
    setLoading(true);
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.9);
    
    setTimeout(() => {
      setResult({
        emotional: { trades: 6, pnl: -420 },
        rational: { trades: 2, pnl: 480 },
      });
      setLoading(false);
    }, 1500);
  };

  const totalDifference = result 
    ? Math.abs(result.rational.pnl - result.emotional.pnl)
    : 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🪞</Text>
        <Text style={styles.title}>Market Mirror</Text>
        <View style={styles.dividerGold} />
        <Text style={styles.subtitle}>
          <Text style={styles.subtitleNormal}>The market didn't beat you.</Text>
          {'\n'}
          <Text style={styles.subtitleBold}>You beat yourself.</Text>
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          loading && styles.buttonLoading,
        ]}
        onPress={replayTradingDay}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Analyzing Your Day...' : 'Replay My Trading Day'}
        </Text>
      </Pressable>

      {result && (
        <Animated.View
          style={[
            styles.resultContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Today's Battle</Text>
              <View style={styles.dividerGoldThin} />
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEmoji}>😤</Text>
                <Text style={styles.sectionTitle}>Emotional You</Text>
              </View>
              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Trades</Text>
                  <Text style={styles.statValue}>{result.emotional.trades}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>P&L</Text>
                  <Text style={[styles.statValue, styles.negativePnl]}>
                    ${result.emotional.pnl}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEmoji}>🧠</Text>
                <Text style={styles.sectionTitle}>Rational You</Text>
              </View>
              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Trades</Text>
                  <Text style={styles.statValue}>{result.rational.trades}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>P&L</Text>
                  <Text style={[styles.statValue, styles.positivePnl]}>
                    +${result.rational.pnl}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.conclusion}>
              <Text style={styles.conclusionText}>
                <Text style={styles.conclusionTextNormal}>The difference: </Text>
                <Text style={styles.conclusionAmount}>${totalDifference}</Text>
              </Text>
              <Text style={styles.lesson}>Your biggest competitor is in the mirror.</Text>
            </View>
          </View>
        </Animated.View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Powered by Vultr • Snowflake • ElevenLabs
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: 16,
    letterSpacing: -1,
  },
  dividerGold: {
    width: 80,
    height: 3,
    backgroundColor: '#FFD700',
    marginBottom: 16,
  },
  dividerGoldThin: {
    width: 60,
    height: 2,
    backgroundColor: '#FFD700',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
  },
  subtitleNormal: {
    color: '#888',
  },
  subtitleBold: {
    color: '#fff',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.85,
  },
  buttonLoading: {
    backgroundColor: '#333',
  },
  buttonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  resultContainer: {
    width: '100%',
  },
  card: {
    backgroundColor: '#0a0a0a',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  cardHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFD700',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#333',
    marginHorizontal: 16,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
  },
  negativePnl: {
    color: '#ff4444',
  },
  positivePnl: {
    color: '#FFD700',
  },
  divider: {
    height: 1,
    backgroundColor: '#FFD700',
    marginVertical: 20,
    opacity: 0.3,
  },
  conclusion: {
    marginTop: 24,
    padding: 20,
    backgroundColor: '#111',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  conclusionText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  conclusionTextNormal: {
    color: '#ccc',
  },
  conclusionAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFD700',
  },
  lesson: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#444',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});