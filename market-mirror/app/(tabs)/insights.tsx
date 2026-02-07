import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';

type Insight = {
  category: string;
  emoji: string;
  title: string;
  description: string;
  actionable: string;
};

const SAMPLE_INSIGHTS: Insight[] = [
  {
    category: 'Pattern Detection',
    emoji: '🔍',
    title: 'You overtrade in the first hour',
    description: 'Analysis shows 60% of your emotional trades happen between 9:30-10:30 AM.',
    actionable: 'Wait 30 minutes after market open before taking your first position.',
  },
  {
    category: 'Emotional Trigger',
    emoji: '⚠️',
    title: 'Revenge trading detected',
    description: 'After losses, you tend to immediately enter new positions to "make it back."',
    actionable: 'Set a rule: After 2 consecutive losses, take a 1-hour break.',
  },
  {
    category: 'Success Pattern',
    emoji: '✅',
    title: 'Your planned trades win 75% of the time',
    description: 'Trades you planned in advance have significantly better outcomes.',
    actionable: 'Journal your trades the night before. Only execute pre-planned setups.',
  },
];

export default function InsightsScreen() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);

  const generateInsights = () => {
    setLoading(true);
    setTimeout(() => {
      setInsights(SAMPLE_INSIGHTS);
      setLoading(false);
    }, 2000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Insights</Text>
        <View style={styles.dividerGold} />
        <Text style={styles.subtitle}>
          Behavioral analysis powered by your trading patterns
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          loading && styles.buttonLoading,
        ]}
        onPress={generateInsights}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" size="small" />
        ) : (
          <Text style={styles.buttonText}>Generate AI Insights</Text>
        )}
      </Pressable>

      {insights.length > 0 && (
        <View style={styles.insightsContainer}>
          {insights.map((insight, index) => (
            <View key={index} style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightEmoji}>{insight.emoji}</Text>
                <Text style={styles.insightCategory}>{insight.category}</Text>
              </View>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightDescription}>{insight.description}</Text>
              <View style={styles.actionableBox}>
                <Text style={styles.actionableLabel}>Action Step</Text>
                <Text style={styles.actionableText}>{insight.actionable}</Text>
              </View>
            </View>
          ))}

          <View style={styles.voiceSection}>
            <Text style={styles.voiceSectionTitle}>🎙️ Voice Insights Coming Soon</Text>
            <Text style={styles.voiceSectionText}>
              Powered by ElevenLabs, you'll soon be able to listen to your daily insights
              narrated with personalized voice coaching.
            </Text>
          </View>
        </View>
      )}

      {insights.length === 0 && !loading && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔮</Text>
          <Text style={styles.emptyText}>
            Generate your personalized insights based on trading patterns and behavioral analysis
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Analysis powered by Snowflake data warehousing and Vultr compute
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
    marginBottom: 32,
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
    lineHeight: 22,
    textAlign: 'center',
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
  insightsContainer: {
    gap: 20,
  },
  insightCard: {
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  insightCategory: {
    fontSize: 11,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  insightTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
  },
  insightDescription: {
    fontSize: 15,
    color: '#aaa',
    lineHeight: 22,
    marginBottom: 16,
  },
  actionableBox: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  actionableLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  actionableText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  voiceSection: {
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginTop: 12,
    opacity: 0.7,
  },
  voiceSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 12,
  },
  voiceSectionText: {
    fontSize: 14,
    color: '#888',
    lineHeight: 22,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    marginTop: 40,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerText: {
    fontSize: 11,
    color: '#444',
    textAlign: 'center',
    lineHeight: 18,
  },
});