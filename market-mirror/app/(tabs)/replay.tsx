import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';

type Trade = {
  time: string;
  action: 'BUY' | 'SELL';
  reason: string;
  profit: number;
  type: 'Emotional' | 'Rational';
  ticker: string;
};

const TRADES: Trade[] = [
  { time: '09:31', action: 'BUY', ticker: 'AAPL', reason: 'FOMO - saw it trending', profit: -120, type: 'Emotional' },
  { time: '09:45', action: 'SELL', ticker: 'AAPL', reason: 'Panic - price dipped', profit: -80, type: 'Emotional' },
  { time: '10:30', action: 'BUY', ticker: 'MSFT', reason: 'Breakout strategy', profit: 300, type: 'Rational' },
  { time: '10:52', action: 'BUY', ticker: 'TSLA', reason: 'Chasing momentum', profit: -95, type: 'Emotional' },
  { time: '11:15', action: 'SELL', ticker: 'MSFT', reason: 'Hit target price', profit: 180, type: 'Rational' },
  { time: '13:42', action: 'BUY', ticker: 'NVDA', reason: 'Revenge trading', profit: -145, type: 'Emotional' },
  { time: '14:05', action: 'SELL', ticker: 'NVDA', reason: 'Stop loss triggered', profit: -60, type: 'Emotional' },
  { time: '15:20', action: 'BUY', ticker: 'SPY', reason: 'Technical setup', profit: 210, type: 'Rational' },
];

export default function ReplayScreen() {
  const [filter, setFilter] = useState<'All' | 'Emotional' | 'Rational'>('All');

  const filteredTrades = TRADES.filter(trade => 
    filter === 'All' ? true : trade.type === filter
  );

  const emotionalTotal = TRADES.filter(t => t.type === 'Emotional')
    .reduce((sum, t) => sum + t.profit, 0);
  const rationalTotal = TRADES.filter(t => t.type === 'Rational')
    .reduce((sum, t) => sum + t.profit, 0);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Trade Replay</Text>
          <View style={styles.dividerGold} />
          <Text style={styles.subtitle}>Your day, broken down by decision quality</Text>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>😤 Emotional</Text>
            <Text style={[styles.summaryValue, styles.negative]}>${emotionalTotal}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>🧠 Rational</Text>
            <Text style={[styles.summaryValue, styles.positive]}>+${rationalTotal}</Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          {(['All', 'Emotional', 'Rational'] as const).map((option) => (
            <Pressable
              key={option}
              style={[
                styles.filterButton,
                filter === option && styles.filterButtonActive,
              ]}
              onPress={() => setFilter(option)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === option && styles.filterTextActive,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.timeline}>
          {filteredTrades.map((trade, i) => (
            <View key={i} style={styles.tradeWrapper}>
              {i < filteredTrades.length - 1 && <View style={styles.timelineLine} />}
              <View
                style={[
                  styles.timelineDot,
                  { backgroundColor: trade.type === 'Rational' ? '#FFD700' : '#ff4444' },
                ]}
              />
              <View
                style={[
                  styles.tradeCard,
                  trade.type === 'Rational' ? styles.tradeCardRational : styles.tradeCardEmotional,
                ]}
              >
                <View style={styles.tradeHeader}>
                  <Text style={styles.tradeTime}>{trade.time}</Text>
                  <View
                    style={[
                      styles.actionBadge,
                      trade.action === 'BUY' ? styles.buyBadge : styles.sellBadge,
                    ]}
                  >
                    <Text style={styles.actionText}>{trade.action}</Text>
                  </View>
                </View>
                <Text style={styles.tradeTicker}>{trade.ticker}</Text>
                <Text style={styles.tradeReason}>{trade.reason}</Text>
                <View style={styles.tradeFooter}>
                  <Text
                    style={[
                      styles.tradeProfit,
                      trade.profit > 0 ? styles.positive : styles.negative,
                    ]}
                  >
                    {trade.profit > 0 ? '+' : ''}${trade.profit}
                  </Text>
                  <Text style={styles.tradeType}>{trade.type}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: 12,
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
  },
  summary: {
    flexDirection: 'row',
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 2,
    backgroundColor: '#FFD700',
    marginHorizontal: 16,
    opacity: 0.3,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  positive: {
    color: '#FFD700',
  },
  negative: {
    color: '#ff4444',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888',
  },
  filterTextActive: {
    color: '#000',
  },
  timeline: {
    position: 'relative',
  },
  tradeWrapper: {
    position: 'relative',
    marginBottom: 20,
    paddingLeft: 32,
  },
  timelineLine: {
    position: 'absolute',
    left: 7,
    top: 16,
    bottom: -20,
    width: 2,
    backgroundColor: '#333',
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 16,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#000',
  },
  tradeCard: {
    borderRadius: 14,
    padding: 18,
    borderWidth: 2,
  },
  tradeCardRational: {
    backgroundColor: '#0a0a0a',
    borderColor: '#FFD700',
  },
  tradeCardEmotional: {
    backgroundColor: '#0a0a0a',
    borderColor: '#ff4444',
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tradeTime: {
    fontSize: 13,
    color: '#888',
    fontWeight: '700',
  },
  actionBadge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buyBadge: {
    backgroundColor: '#FFD70033',
  },
  sellBadge: {
    backgroundColor: '#ff444433',
  },
  actionText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  tradeTicker: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFD700',
    marginBottom: 8,
  },
  tradeReason: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 14,
    fontStyle: 'italic',
  },
  tradeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  tradeProfit: {
    fontSize: 20,
    fontWeight: '900',
  },
  tradeType: {
    fontSize: 11,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '700',
  },
});