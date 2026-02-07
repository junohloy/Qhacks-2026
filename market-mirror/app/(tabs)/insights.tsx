import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';

type Purchase = {
  id: number;
  item: string;
  date: string;
  type: 'emotional' | 'rational';
  amount: number;
};

const SAMPLE_HISTORY: Purchase[] = [
  { id: 1, item: 'New Headphones', date: 'Today, 2:30 PM', type: 'emotional', amount: 150 },
  { id: 2, item: 'Grocery Shopping', date: 'Yesterday', type: 'rational', amount: 85 },
  { id: 3, item: 'Coffee Maker', date: '2 days ago', type: 'rational', amount: 120 },
  { id: 4, item: 'Impulse Clothing', date: '3 days ago', type: 'emotional', amount: 200 },
  { id: 5, item: 'Monthly Utilities', date: '1 week ago', type: 'rational', amount: 180 },
];

export default function InsightsScreen() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');

  const emotionalPurchases = SAMPLE_HISTORY.filter(p => p.type === 'emotional');
  const rationalPurchases = SAMPLE_HISTORY.filter(p => p.type === 'rational');

  const emotionalTotal = emotionalPurchases.reduce((sum, p) => sum + p.amount, 0);
  const rationalTotal = rationalPurchases.reduce((sum, p) => sum + p.amount, 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Insights</Text>
        <View style={styles.dividerGold} />
        <Text style={styles.subtitle}>
          Understanding your purchase patterns helps you grow
        </Text>
      </View>

      <View style={styles.timeframeSelector}>
        {(['week', 'month', 'all'] as const).map((option) => (
          <Pressable
            key={option}
            style={[
              styles.timeframeButton,
              timeframe === option && styles.timeframeButtonActive,
            ]}
            onPress={() => setTimeframe(option)}
          >
            <Text
              style={[
                styles.timeframeText,
                timeframe === option && styles.timeframeTextActive,
              ]}
            >
              {option === 'week' ? 'This Week' : option === 'month' ? 'This Month' : 'All Time'}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Your Balance</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>💭 Emotional</Text>
            <Text style={[styles.summaryValue, styles.emotionalColor]}>
              ${emotionalTotal}
            </Text>
            <Text style={styles.summaryCount}>{emotionalPurchases.length} purchases</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>🧠 Rational</Text>
            <Text style={[styles.summaryValue, styles.rationalColor]}>
              ${rationalTotal}
            </Text>
            <Text style={styles.summaryCount}>{rationalPurchases.length} purchases</Text>
          </View>
        </View>
      </View>

      <View style={styles.insightsSection}>
        <Text style={styles.sectionTitle}>Patterns We've Noticed</Text>
        
        <View style={styles.insightCard}>
          <Text style={styles.insightEmoji}>🎯</Text>
          <Text style={styles.insightTitle}>You're doing great!</Text>
          <Text style={styles.insightText}>
            {rationalPurchases.length > emotionalPurchases.length
              ? "You're making more thoughtful decisions than emotional ones. Keep it up!"
              : "You're becoming more aware of your purchase triggers. That's the first step to better decisions!"}
          </Text>
        </View>

        {emotionalPurchases.length > 0 && (
          <View style={styles.insightCard}>
            <Text style={styles.insightEmoji}>💡</Text>
            <Text style={styles.insightTitle}>Tip for Next Time</Text>
            <Text style={styles.insightText}>
              Before an emotional purchase, try talking to a friend in the Community tab.
              Sometimes just expressing our thoughts helps clarify them!
            </Text>
          </View>
        )}
      </View>

      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Recent Check-Ins</Text>
        {SAMPLE_HISTORY.map((purchase) => (
          <View key={purchase.id} style={styles.historyItem}>
            <View style={styles.historyLeft}>
              <Text style={styles.historyEmoji}>
                {purchase.type === 'emotional' ? '💭' : '🧠'}
              </Text>
              <View style={styles.historyInfo}>
                <Text style={styles.historyItem}>{purchase.item}</Text>
                <Text style={styles.historyDate}>{purchase.date}</Text>
              </View>
            </View>
            <Text style={[
              styles.historyAmount,
              purchase.type === 'emotional' ? styles.emotionalColor : styles.rationalColor
            ]}>
              ${purchase.amount}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.encouragementBox}>
        <Text style={styles.encouragementText}>
          Remember: Every check-in is a step toward better financial awareness. You're not
          trying to be perfect – you're trying to be mindful. 💛
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
    marginBottom: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 12,
    fontFamily: 'System',
  },
  dividerGold: {
    width: 60,
    height: 3,
    backgroundColor: '#FFD700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    fontFamily: 'System',
  },
  timeframeSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
  },
  timeframeButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  timeframeText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  timeframeTextActive: {
    color: '#000',
  },
  summaryCard: {
    backgroundColor: '#0a0a0a',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 16,
    padding: 24,
    marginBottom: 28,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'System',
  },
  summaryRow: {
    flexDirection: 'row',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 2,
    backgroundColor: '#FFD700',
    opacity: 0.3,
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
    fontFamily: 'System',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 4,
    fontFamily: 'System',
  },
  summaryCount: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'System',
  },
  emotionalColor: {
    color: '#ff8844',
  },
  rationalColor: {
    color: '#FFD700',
  },
  insightsSection: {
    marginBottom: 28,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    fontFamily: 'System',
  },
  insightCard: {
    backgroundColor: '#111',
    borderRadius: 14,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  insightEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    fontFamily: 'System',
  },
  insightText: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 22,
    fontFamily: 'System',
  },
  historySection: {
    marginBottom: 28,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyEmoji: {
    fontSize: 28,
    marginRight: 14,
  },
  historyInfo: {
    flex: 1,
  },
  historyItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'System',
  },
  historyDate: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'System',
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'System',
  },
  encouragementBox: {
    backgroundColor: '#0a0a0a',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 16,
    padding: 24,
  },
  encouragementText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'System',
  },
});