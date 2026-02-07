import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';

type Question = {
  id: number;
  question: string;
  type: 'choice' | 'scale' | 'text';
  options?: string[];
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'What are you thinking about purchasing?',
    type: 'text',
  },
  {
    id: 2,
    question: 'How are you feeling right now?',
    type: 'choice',
    options: ['Excited', 'Stressed', 'Happy', 'Anxious', 'Calm', 'Impulsive'],
  },
  {
    id: 3,
    question: 'Have you been thinking about this purchase for a while?',
    type: 'choice',
    options: ['Just now', 'A few hours', 'A few days', 'Weeks or more'],
  },
  {
    id: 4,
    question: 'On a scale of 1-10, how much do you NEED this?',
    type: 'scale',
  },
  {
    id: 5,
    question: 'What triggered this purchase idea?',
    type: 'choice',
    options: ['Saw an ad', 'Friend recommended', 'Been planning', 'Feeling emotional', 'Random impulse'],
  },
];

export default function HomeScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [textInput, setTextInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ type: 'emotional' | 'rational'; score: number } | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentQuestion, fadeAnim]);

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [QUESTIONS[currentQuestion].id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      fadeAnim.setValue(0);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 200);
    } else {
      analyzeAnswers(newAnswers);
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      handleAnswer(textInput);
      setTextInput('');
    }
  };

  const analyzeAnswers = (allAnswers: { [key: number]: string }) => {
    let emotionalScore = 0;

    if (allAnswers[2] === 'Excited' || allAnswers[2] === 'Anxious' || allAnswers[2] === 'Impulsive') {
      emotionalScore += 3;
    }
    if (allAnswers[3] === 'Just now' || allAnswers[3] === 'A few hours') {
      emotionalScore += 3;
    }
    if (allAnswers[5] === 'Saw an ad' || allAnswers[5] === 'Feeling emotional' || allAnswers[5] === 'Random impulse') {
      emotionalScore += 3;
    }

    const needScore = parseInt(allAnswers[4]) || 5;
    if (needScore < 6) {
      emotionalScore += 2;
    }

    const purchaseType = emotionalScore >= 6 ? 'emotional' : 'rational';
    setResult({ type: purchaseType, score: emotionalScore });
    setShowResult(true);
  };

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setResult(null);
    setTextInput('');
  };

  if (showResult && result) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultEmoji}>
            {result.type === 'emotional' ? '💭' : '🧠'}
          </Text>
          <Text style={styles.resultTitle}>
            {result.type === 'emotional' ? 'Emotional Purchase' : 'Rational Decision'}
          </Text>
          <View style={styles.dividerGold} />
          
          {result.type === 'emotional' ? (
            <View style={styles.messageBox}>
              <Text style={styles.messageTitle}>Let's pause for a moment</Text>
              <Text style={styles.messageText}>
                Your answers suggest this might be an emotional purchase. That's totally okay!
                We all make them. But let's think it through:
              </Text>
              <View style={styles.tipsContainer}>
                <Text style={styles.tip}>💡 Try the 24-hour rule - wait a day before buying</Text>
                <Text style={styles.tip}>💡 Ask a friend for their opinion</Text>
                <Text style={styles.tip}>💡 Check if this fits your budget</Text>
                <Text style={styles.tip}>💡 Consider if you'll use it in 6 months</Text>
              </View>
            </View>
          ) : (
            <View style={styles.messageBox}>
              <Text style={styles.messageTitle}>Great job thinking it through!</Text>
              <Text style={styles.messageText}>
                Your answers suggest this is a well-considered decision. You've thought about
                the need, timing, and reasons. If it fits your budget, go for it!
              </Text>
              <View style={styles.encouragementBox}>
                <Text style={styles.encouragementText}>
                  ✨ Remember: Thoughtful decisions lead to happier outcomes
                </Text>
              </View>
            </View>
          )}

          <View style={styles.actionButtons}>
            <Pressable style={styles.secondaryButton} onPress={restart}>
              <Text style={styles.secondaryButtonText}>Check Another Purchase</Text>
            </Pressable>
            <Pressable style={styles.primaryButton} onPress={() => {}}>
              <Text style={styles.primaryButtonText}>Share with Community</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

  const question = QUESTIONS[currentQuestion];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Purchase Check-In</Text>
        <View style={styles.dividerGold} />
        <Text style={styles.subtitle}>
          Let's understand if this is an emotional or rational decision
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {QUESTIONS.length}
        </Text>
      </View>

      <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
        <Text style={styles.questionText}>{question.question}</Text>

        {question.type === 'text' && (
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={textInput}
              onChangeText={setTextInput}
              placeholder="Type your answer here..."
              placeholderTextColor="#666"
              multiline
              onSubmitEditing={handleTextSubmit}
            />
            <Pressable
              style={[styles.submitButton, !textInput.trim() && styles.submitButtonDisabled]}
              onPress={handleTextSubmit}
              disabled={!textInput.trim()}
            >
              <Text style={styles.submitButtonText}>Continue</Text>
            </Pressable>
          </View>
        )}

        {question.type === 'choice' && question.options && (
          <View style={styles.choicesContainer}>
            {question.options.map((option, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.choiceButton,
                  pressed && styles.choiceButtonPressed,
                ]}
                onPress={() => handleAnswer(option)}
              >
                <Text style={styles.choiceText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {question.type === 'scale' && (
          <View style={styles.scaleContainer}>
            <View style={styles.scaleLabels}>
              <Text style={styles.scaleLabel}>Not needed</Text>
              <Text style={styles.scaleLabel}>Essential</Text>
            </View>
            <View style={styles.scaleButtons}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <Pressable
                  key={num}
                  style={({ pressed }) => [
                    styles.scaleButton,
                    pressed && styles.scaleButtonPressed,
                  ]}
                  onPress={() => handleAnswer(num.toString())}
                >
                  <Text style={styles.scaleButtonText}>{num}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
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
    textAlign: 'center',
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
    lineHeight: 22,
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
  textInputContainer: {
    gap: 16,
  },
  textInput: {
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    minHeight: 100,
    textAlignVertical: 'top',
    fontFamily: 'System',
  },
  submitButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'System',
  },
  choicesContainer: {
    gap: 12,
  },
  choiceButton: {
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  choiceButtonPressed: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  choiceText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  scaleContainer: {
    gap: 16,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleLabel: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'System',
  },
  scaleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  scaleButton: {
    width: 50,
    height: 50,
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleButtonPressed: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  scaleButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
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
  resultTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 12,
    fontFamily: 'System',
  },
  messageBox: {
    backgroundColor: '#0a0a0a',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
    width: '100%',
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    fontFamily: 'System',
  },
  messageText: {
    fontSize: 15,
    color: '#aaa',
    lineHeight: 24,
    marginBottom: 20,
    fontFamily: 'System',
  },
  tipsContainer: {
    gap: 12,
  },
  tip: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
    fontFamily: 'System',
  },
  encouragementBox: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  encouragementText: {
    fontSize: 14,
    color: '#FFD700',
    textAlign: 'center',
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
});