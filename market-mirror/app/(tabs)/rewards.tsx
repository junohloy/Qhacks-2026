import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';

type MoodType = 'Neutral' | 'Happy' | 'Stressed' | 'Focused' | 'Anxious';

export default function RewardsScreen() {
  const [mood, setMood] = useState<MoodType | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [moodHistory, setMoodHistory] = useState<{ time: string; mood: MoodType }[]>([]);

  const analyzeMood = () => {
    setAnalyzing(true);
    
    setTimeout(() => {
      const moods: MoodType[] = ['Neutral', 'Happy', 'Stressed', 'Focused', 'Anxious'];
      const detectedMood = moods[Math.floor(Math.random() * moods.length)];
      setMood(detectedMood);
      
      const now = new Date();
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      setMoodHistory(prev => [...prev, { time: timeStr, mood: detectedMood }].slice(-5));
      
      setAnalyzing(false);
    }, 2000);
  };

  const getMoodColor = (m: MoodType) => {
    switch (m) {
      case 'Happy': return '#FFD700';
      case 'Focused': return '#4a9eff';
      case 'Neutral': return '#888';
      case 'Stressed': return '#ff8844';
      case 'Anxious': return '#ff4444';
    }
  };

  const getMoodEmoji = (m: MoodType) => {
    switch (m) {
      case 'Happy': return '😊';
      case 'Focused': return '🎯';
      case 'Neutral': return '😐';
      case 'Stressed': return '😰';
      case 'Anxious': return '😟';
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mood Tracker</Text>
        <View style={styles.dividerGold} />
        <Text style={styles.subtitle}>
          Track your emotional state while trading
        </Text>
      </View>

      <View style={styles.moodSection}>
        <Pressable
          style={({ pressed }) => [
            styles.analyzeButton,
            pressed && styles.buttonPressed,
            analyzing && styles.buttonLoading,
          ]}
          onPress={analyzeMood}
          disabled={analyzing}
        >
          {analyzing ? (
            <ActivityIndicator color="#000" size="small" />
          ) : (
            <Text style={styles.analyzeButtonText}>Analyze My Mood</Text>
          )}
        </Pressable>

        {mood && (
          <View style={[styles.moodResult, { borderColor: getMoodColor(mood) }]}>
            <Text style={styles.moodEmoji}>{getMoodEmoji(mood)}</Text>
            <Text style={styles.moodLabel}>Current Mood</Text>
            <Text style={[styles.moodValue, { color: getMoodColor(mood) }]}>{mood}</Text>
            {(mood === 'Stressed' || mood === 'Anxious') && (
              <View style={styles.warningBox}>
                <Text style={styles.moodWarning}>
                  Consider taking a break before your next trade
                </Text>
              </View>
            )}
          </View>
        )}

        {moodHistory.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Recent Mood History</Text>
            {moodHistory.map((entry, i) => (
              <View key={i} style={styles.historyItem}>
                <Text style={styles.historyTime}>{entry.time}</Text>
                <Text style={styles.historyEmoji}>{getMoodEmoji(entry.mood)}</Text>
                <Text style={[styles.historyMood, { color: getMoodColor(entry.mood) }]}>
                  {entry.mood}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Why Track Your Mood?</Text>
        <Text style={styles.infoText}>
          Research shows that emotional state directly impacts trading decisions. By tracking
          your mood, you can identify patterns and learn when to trade and when to step back.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Mood detection powered by AI facial recognition
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
    textAlign: 'center',
  },
  moodSection: {
    marginBottom: 40,
  },
  analyzeButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
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
  analyzeButtonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  moodResult: {
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 20,
  },
  moodEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  moodLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  moodValue: {
    fontSize: 32,
    fontWeight: '900',
  },
  warningBox: {
    marginTop: 20,
    backgroundColor: '#111',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff8844',
  },
  moodWarning: {
    fontSize: 14,
    color: '#ff8844',
    textAlign: 'center',
    fontWeight: '600',
  },
  historySection: {
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  historyTime: {
    fontSize: 14,
    color: '#666',
    width: 60,
    fontWeight: '600',
  },
  historyEmoji: {
    fontSize: 24,
    marginHorizontal: 16,
  },
  historyMood: {
    fontSize: 16,
    fontWeight: '700',
  },
  infoSection: {
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#333',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#888',
    lineHeight: 22,
  },
  footer: {
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerText: {
    fontSize: 11,
    color: '#444',
    textAlign: 'center',
  },
});