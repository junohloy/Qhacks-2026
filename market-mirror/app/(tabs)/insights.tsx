import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import React from 'react';


type Purchase = {
  id: number;
  item: string;
  date: string;
  type: 'emotional' | 'rational';
  amount: number;
  mood: string;
  time: string;
  reason: string;
};

const ALL_PURCHASES: Purchase[] = [
  // Today
  { id: 1, item: 'New Headphones', date: 'Today', time: '2:30 PM', type: 'emotional', amount: 150, mood: 'Excited', reason: 'Saw influencer review' },
  { id: 2, item: 'Grocery Shopping', date: 'Today', time: '10:00 AM', type: 'rational', amount: 85, mood: 'Calm', reason: 'Weekly meal prep' },
  
  // Yesterday
  { id: 3, item: 'Coffee Maker', date: 'Yesterday', time: '3:15 PM', type: 'rational', amount: 120, mood: 'Happy', reason: 'Old one broke' },
  { id: 4, item: 'Impulse Clothing', date: 'Yesterday', time: '8:45 PM', type: 'emotional', amount: 200, mood: 'Stressed', reason: 'Had a bad day' },
  
  // This Week
  { id: 5, item: 'Monthly Utilities', date: '2 days ago', time: '9:00 AM', type: 'rational', amount: 180, mood: 'Neutral', reason: 'Scheduled payment' },
  { id: 6, item: 'Video Game', date: '3 days ago', time: '11:30 PM', type: 'emotional', amount: 60, mood: 'Impulsive', reason: 'Bored scrolling' },
  { id: 7, item: 'Workout Equipment', date: '5 days ago', time: '7:00 AM', type: 'rational', amount: 250, mood: 'Energized', reason: 'Fitness goal' },
  
  // This Month
  { id: 8, item: 'Takeout Food', date: '1 week ago', time: '8:00 PM', type: 'emotional', amount: 45, mood: 'Anxious', reason: 'Too tired to cook' },
  { id: 9, item: 'Books for Course', date: '1 week ago', time: '2:00 PM', type: 'rational', amount: 95, mood: 'Focused', reason: 'Required reading' },
  { id: 10, item: 'Concert Tickets', date: '2 weeks ago', time: '6:00 PM', type: 'emotional', amount: 180, mood: 'Excited', reason: 'Favorite band' },
  { id: 11, item: 'Car Maintenance', date: '2 weeks ago', time: '10:00 AM', type: 'rational', amount: 350, mood: 'Neutral', reason: 'Scheduled service' },
  
  // All Time
  { id: 12, item: 'Designer Bag', date: '3 weeks ago', time: '1:00 PM', type: 'emotional', amount: 800, mood: 'Impulsive', reason: 'Flash sale' },
  { id: 13, item: 'Laptop Upgrade', date: '1 month ago', time: '11:00 AM', type: 'rational', amount: 1200, mood: 'Calm', reason: 'Work necessity' },
  { id: 14, item: 'Subscription Service', date: '1 month ago', time: '9:00 PM', type: 'emotional', amount: 15, mood: 'Bored', reason: 'Saw ad' },
  { id: 15, item: 'Insurance Payment', date: '1 month ago', time: '8:00 AM', type: 'rational', amount: 200, mood: 'Neutral', reason: 'Monthly bill' },
];

type Timeframe = 'daily' | 'weekly' | 'monthly' | 'all';

export default function InsightsScreen() {
  const [timeframe, setTimeframe] = useState<Timeframe>('weekly');

  const getFilteredPurchases = () => {
    switch (timeframe) {
      case 'daily':
        return ALL_PURCHASES.filter(p => p.date === 'Today');
      case 'weekly':
        return ALL_PURCHASES.filter(p => 
          ['Today', 'Yesterday', '2 days ago', '3 days ago', '5 days ago'].includes(p.date)
        );
      case 'monthly':
        return ALL_PURCHASES.filter(p => 
          !p.date.includes('month')
        );
      case 'all':
        return ALL_PURCHASES;
      default:
        return ALL_PURCHASES;
    }
  };

  const filteredPurchases = getFilteredPurchases();
  const emotionalPurchases = filteredPurchases.filter(p => p.type === 'emotional');
  const rationalPurchases = filteredPurchases.filter(p => p.type === 'rational');

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
        {(['daily', 'weekly', 'monthly', 'all'] as const).map((option) => (
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
              {option.charAt(0).toUpperCase() + option.slice(1)}
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
        <Text style={styles.sectionTitle}>Purchase Timeline</Text>
        <View style={styles.timeline}>
          {filteredPurchases.map((purchase, index) => (
            <View key={purchase.id} style={styles.timelineItem}>
              {index < filteredPurchases.length - 1 && <View style={styles.timelineLine} />}
              <View
                style={[
                  styles.timelineDot,
                  { backgroundColor: purchase.type === 'rational' ? '#FFD700' : '#ff8844' },
                ]}
              />
              <View
                style={[
                  styles.purchaseCard,
                  purchase.type === 'rational' ? styles.purchaseCardRational : styles.purchaseCardEmotional,
                ]}
              >
                <View style={styles.purchaseHeader}>
                  <View style={styles.purchaseHeaderLeft}>
                    <Text style={styles.purchaseEmoji}>
                      {purchase.type === 'emotional' ? '💭' : '🧠'}
                    </Text>
                    <View>
                      <Text style={styles.purchaseDate}>{purchase.date}</Text>
                      <Text style={styles.purchaseTime}>{purchase.time}</Text>
                    </View>
                  </View>
                  <Text style={[
                    styles.purchaseAmount,
                    purchase.type === 'emotional' ? styles.emotionalColor : styles.rationalColor
                  ]}>
                    ${purchase.amount}
                  </Text>
                </View>
                
                <Text style={styles.purchaseItem}>{purchase.item}</Text>
                <Text style={styles.purchaseReason}>{purchase.reason}</Text>
                
                <View style={styles.purchaseFooter}>
                  <Text style={styles.purchaseMood}>Mood: {purchase.mood}</Text>
                  <Text style={styles.purchaseType}>
                    {purchase.type === 'emotional' ? 'Emotional' : 'Rational'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
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
    gap: 8,
    marginBottom: 24,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 10,
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
    fontSize: 12,
    fontWeight: '700',
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
  timeline: {
    position: 'relative',
  },
  timelineItem: {
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
  purchaseCard: {
    borderRadius: 14,
    padding: 18,
    borderWidth: 2,
  },
  purchaseCardRational: {
    backgroundColor: '#0a0a0a',
    borderColor: '#FFD700',
  },
  purchaseCardEmotional: {
    backgroundColor: '#0a0a0a',
    borderColor: '#ff8844',
  },
  purchaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  purchaseHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  purchaseEmoji: {
    fontSize: 28,
  },
  purchaseDate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'System',
  },
  purchaseTime: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'System',
  },
  purchaseAmount: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: 'System',
  },
  purchaseItem: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
    fontFamily: 'System',
  },
  purchaseReason: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 14,
    fontStyle: 'italic',
    fontFamily: 'System',
  },
  purchaseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  purchaseMood: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'System',
  },
  purchaseType: {
    fontSize: 11,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '700',
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