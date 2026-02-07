import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';

type MoodQuestion = {
  id: number;
  question: string;
  options: { text: string; score: number }[];
};

const MOOD_QUESTIONS: MoodQuestion[] = [
  {
    id: 1,
    question: 'How would you describe your energy right now?',
    options: [
      { text: 'Exhausted', score: -2 },
      { text: 'Low energy', score: -1 },
      { text: 'Normal', score: 0 },
      { text: 'Energized', score: 1 },
      { text: 'Super pumped', score: 2 },
    ],
  },
  {
    id: 2,
    question: 'How\'s your stress level?',
    options: [
      { text: 'Very stressed', score: -2 },
      { text: 'Somewhat stressed', score: -1 },
      { text: 'Neutral', score: 0 },
      { text: 'Calm', score: 1 },
      { text: 'Completely relaxed', score: 2 },
    ],
  },
  {
    id: 3,
    question: 'How are you feeling emotionally?',
    options: [
      { text: 'Sad or down', score: -2 },
      { text: 'A bit low', score: -1 },
      { text: 'Okay', score: 0 },
      { text: 'Happy', score: 1 },
      { text: 'Very happy', score: 2 },
    ],
  },
  {
    id: 4,
    question: 'How impulsive do you feel?',
    options: [
      { text: 'Very impulsive', score: -2 },
      { text: 'Somewhat impulsive', score: -1 },
      { text: 'Balanced', score: 0 },
      { text: 'Thoughtful', score: 1 },
      { text: 'Very deliberate', score: 2 },
    ],
  },
];

type MoodResult = {
  mood: string;
  emoji: string;
  color: string;
  advice: string;
};

export default function MoodScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<MoodResult | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentQuestion, fadeAnim]);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestion < MOOD_QUESTIONS.length - 1) {
      fadeAnim.setValue(0);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 200);
    } else {
      analyzeMood(newAnswers);
    }
  };

  const analyzeMood = (allAnswers: number[]) => {
    const totalScore = allAnswers.reduce((sum, score) => sum + score, 0);
    const avgScore = totalScore / allAnswers.length;

    let moodResult: MoodResult;

    if (avgScore >= 1.5) {
      moodResult = {
        mood: 'Excellent',
        emoji: '🌟',
        color: '#FFD700',
        advice: 'You\'re in a great headspace! This is an ideal time for making important decisions. Your energy and positivity will help you think clearly.',
      };
    } else if (avgScore >= 0.5) {
      moodResult = {
        mood: 'Good',
        emoji: '😊',
        color: '#90EE90',
        advice: 'You\'re feeling pretty good! You\'re in a balanced state, which is perfect for thoughtful decision-making.',
      };
    } else if (avgScore >= -0.5) {
      moodResult = {
        mood: 'Neutral',
        emoji: '😐',
        color: '#888',
        advice: 'You\'re feeling okay. Before making big purchases, take a moment to check in with yourself about whether this is something you truly need.',
      };
    } else if (avgScore >= -1.5) {
      moodResult = {
        mood: 'Low',
        emoji: '😔',
        color: '#ff8844',
        advice: 'You\'re feeling a bit down or stressed. It might be best to wait on non-essential purchases. Consider talking to a friend or taking some self-care time.',
      };
    } else {
      moodResult = {
        mood: 'Challenging',
        emoji: '😰',
        color: '#ff4444',
        advice: 'You\'re going through a tough time right now. We recommend avoiding major purchase decisions today. Reach out to your community for support instead.',
      };
    }

    setResult(moodResult);
    setShowResult(true);
  };

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setResult(null);
  };

  if (showResult && result) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultEmoji}>{result.emoji}</Text>
          <Text style={styles.resultMood}>You're feeling {result.mood}</Text>
          <View style={styles.dividerGold} />
          
          <View style={[styles.adviceBox, { borderColor: result.color }]}>
            <Text style={styles.adviceTitle}>What this means for you</Text>
            <Text style={styles.adviceText}>{result.advice}</Text>
          </View>

          <View style={styles.actionButtons}>
            <Pressable style={styles.secondaryButton} onPress={restart}>
              <Text style={styles.secondaryButtonText}>Check Again</Text>
            </Pressable>
            <Pressable style={styles.primaryButton} onPress={() => {}}>
              <Text style={styles.primaryButtonText}>Log This Mood</Text>
            </Pressable>
          </View>

          <View style={styles.tipBox}>
            <Text style={styles.tipEmoji}>💡</Text>
            <Text style={styles.tipText}>
              Check your mood before making purchases to understand if emotions are influencing
              your decisions
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  const question = MOOD_QUESTIONS[currentQuestion];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mood Check-In</Text>
        <View style={styles.dividerGold} />
        <Text style={styles.subtitle}>
          Let's understand how you're feeling right now
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentQuestion + 1) / MOOD_QUESTIONS.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {MOOD_QUESTIONS.length}
        </Text>
      </View>

      <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
        <Text style={styles.questionText}>{question.question}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.optionButton,
                pressed && styles.optionButtonPressed,
              ]}
              onPress={() => handleAnswer(option.score)}
            >
              <Text style={styles.optionText}>{option.text}</Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      {currentQuestion > 0 && (
        <Pressable style={styles.backButton} onPress={() => setCurrentQuestion(currentQuestion - 1)}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
      )}
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
    marginBottom: 32,
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
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#222',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'System',
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 24,
    lineHeight: 32,
    fontFamily: 'System',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  optionButtonPressed: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#888',
    fontSize: 15,
    fontFamily: 'System',
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  resultMood: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 12,
    fontFamily: 'System',
  },
  adviceBox: {
    backgroundColor: '#0a0a0a',
    borderWidth: 2,
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
    width: '100%',
  },
  adviceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    fontFamily: 'System',
  },
  adviceText: {
    fontSize: 15,
    color: '#aaa',
    lineHeight: 24,
    fontFamily: 'System',
  },
  actionButtons: {
    marginTop: 32,
    gap: 12,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'System',
  },
  secondaryButton: {
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'System',
  },
  tipBox: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  tipEmoji: {
    fontSize: 24,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#aaa',
    lineHeight: 22,
    fontFamily: 'System',
  },
});