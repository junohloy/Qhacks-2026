import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Animated, Modal, Image } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { GoogleGenerativeAI } from "@google/generative-ai";
import React from 'react';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY ? GEMINI_API_KEY.toString() : "");

type Question = {
  id: number;
  question: string;
  type: 'choice' | 'scale' | 'text' | 'photo_or_text';
  options?: string[];
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'What are you thinking about purchasing?',
    type: 'photo_or_text',
  },
  {
    id: 2,
    question: 'How are you feeling right now?',
    type: 'choice',
    options: ['Excited', 'Stressed', 'Happy', 'Anxious', 'Calm', 'Impulsive'],
  },
  {
    id: 3,
    question: 'How would you describe your energy level?',
    type: 'choice',
    options: ['Exhausted', 'Low energy', 'Normal', 'Energized', 'Very energized'],
  },
  {
    id: 4,
    question: 'What is your stress level right now?',
    type: 'choice',
    options: ['Very stressed', 'Somewhat stressed', 'Neutral', 'Calm', 'Very relaxed'],
  },
  {
    id: 5,
    question: 'Have you been thinking about this purchase for a while?',
    type: 'choice',
    options: ['Just now', 'A few hours', 'A few days', 'Weeks or more'],
  },
  {
    id: 6,
    question: 'On a scale of 1-10, how much do you NEED this?',
    type: 'scale',
  },
  {
    id: 7,
    question: 'What triggered this purchase idea?',
    type: 'choice',
    options: ['Saw an ad', 'Friend recommended', 'Been planning', 'Feeling emotional', 'Random impulse'],
  },
  {
    id: 8,
    question: 'How impulsive are you feeling?',
    type: 'choice',
    options: ['Very impulsive', 'Somewhat impulsive', 'Balanced', 'Thoughtful', 'Very deliberate'],
  },
];

// Global state for community posts
export let communityPosts: any[] = [];

export function addCommunityPost(post: any) {
  communityPosts.unshift(post);
}

export function getCommunityPosts() {
  return communityPosts;
}

export default function HomeScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [textDescription, setTextDescription] = useState('');
  const [textInput, setTextInput] = useState('');
  const [inputMethod, setInputMethod] = useState<'photo' | 'text' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ 
    type: 'emotional' | 'rational'; 
    score: number;
    mood: string;
    photoUri: string | null;
    itemDescription: string;
  } | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareQuestion, setShareQuestion] = useState('');
  const [sharePrice, setSharePrice] = useState('');
  const [shareItemName, setShareItemName] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentQuestion, fadeAnim]);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      alert('Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      setInputMethod('photo');
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Gallery permission is required to select photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      setInputMethod('photo');
    }
  };

  const handlePhotoOrTextSubmit = () => {
    if (inputMethod === 'photo' && photoUri) {
      handleAnswer(photoUri);
    } else if (inputMethod === 'text' && textDescription.trim()) {
      handleAnswer(textDescription);
    } else {
      alert('Please either take a photo or enter a description');
    }
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [QUESTIONS[currentQuestion].id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      fadeAnim.setValue(0);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 200);
    } else {
      analyzeAnswersWithGemini(newAnswers);
    }
  };

  const analyzeAnswersWithGemini = async (allAnswers: { [key: number]: string }) => {
  setIsAnalyzing(true);

  try {
    // Format the answers into a readable context for Gemini
    const formattedAnswers = `
Purchase Item: ${allAnswers[1]}
Current Feeling: ${allAnswers[2]}
Consideration Time: ${allAnswers[3]}
Need Score (1-10): ${allAnswers[4]}
Purchase Trigger: ${allAnswers[5]}
`;

    const prompt = `You are a thoughtful financial advisor analyzing a potential purchase decision. Based on the following user responses, determine if this is an EMOTIONAL purchase or a RATIONAL decision.

${formattedAnswers}

Analyze these responses considering:
1. Emotional state and its impact on decision-making
2. Time spent considering the purchase
3. The actual need vs want
4. What triggered the purchase desire
5. Overall impulsivity signals

Respond ONLY with a JSON object in this exact format (no markdown, no extra text):
{
  "type": "emotional" or "rational",
  "score": [number from 0-10, where 10 is most emotional],
  "reasoning": "[brief 1-2 sentence explanation]"
}`;

    // Use SDK format from Google docs
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    const geminiResponse = result.response.text();
    
    // Parse the JSON response from Gemini
    const cleanedResponse = geminiResponse.replace(/```json\n?|\n?```/g, '').trim();
    const analysis = JSON.parse(cleanedResponse);

    setResult({
      type: analysis.type,
      score: analysis.score,
    });
    setShowResult(true);
  } catch (error) {
    console.error('Error analyzing with Gemini:', error);
    // Fallback to original algorithm if API fails
    analyzeAnswersFallback(allAnswers);
  } finally {
    setIsAnalyzing(false);
  }
};

  // Fallback function using original algorithm
  const analyzeAnswersFallback = (allAnswers: { [key: number]: string }) => {
    let emotionalScore = 0;

    if (allAnswers[2] === 'Excited' || allAnswers[2] === 'Anxious' || allAnswers[2] === 'Impulsive') {
      emotionalScore += 2;
    }
    
    if (allAnswers[3] === 'Exhausted' || allAnswers[3] === 'Very energized') {
      emotionalScore += 1;
    }

    if (allAnswers[4] === 'Very stressed' || allAnswers[4] === 'Somewhat stressed') {
      emotionalScore += 2;
    }

    if (allAnswers[5] === 'Just now' || allAnswers[5] === 'A few hours') {
      emotionalScore += 2;
    }

    if (allAnswers[7] === 'Saw an ad' || allAnswers[7] === 'Feeling emotional' || allAnswers[7] === 'Random impulse') {
      emotionalScore += 2;
    }

    if (allAnswers[8] === 'Very impulsive' || allAnswers[8] === 'Somewhat impulsive') {
      emotionalScore += 2;
    }

    const needScore = parseInt(allAnswers[6]) || 5;
    if (needScore < 6) {
      emotionalScore += 2;
    }

    const purchaseType = emotionalScore >= 7 ? 'emotional' : 'rational';
    
    setResult({ 
      type: purchaseType, 
      score: emotionalScore,
      mood: allAnswers[2],
      photoUri: inputMethod === 'photo' ? photoUri : null,
      itemDescription: allAnswers[1]
    });
    setShowResult(true);
  };

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setResult(null);
    setPhotoUri(null);
    setTextDescription('');
    setInputMethod(null);
  };

  const openShareModal = () => {
    setShareQuestion('');
    setSharePrice('');
    setShareItemName('');
    setShowShareModal(true);
  };

  const shareWithCommunity = () => {
    if (!shareQuestion.trim() || !sharePrice.trim() || !shareItemName.trim() || !result) return;

    const newPost = {
      id: Date.now(),
      user: 'You',
      avatar: '😊',
      question: shareQuestion,
      item: shareItemName,
      price: parseFloat(sharePrice),
      mood: result.mood,
      type: result.type,
      photoUri: result.photoUri,
      votes: { yes: 0, no: 0, maybe: 0 },
      comments: [],
      timeAgo: 'Just now',
    };

    addCommunityPost(newPost);
    
    setShowShareModal(false);
    alert('Posted to community! Check the Community tab to see your post.');
  };

  if (isAnalyzing) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.loadingEmoji}>🤔</Text>
        <Text style={styles.loadingText}>Analyzing your responses...</Text>
        <Text style={styles.loadingSubtext}>Using AI to understand your decision</Text>
      </View>
    );
  }

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
          
          {result.photoUri && (
            <Image source={{ uri: result.photoUri }} style={styles.resultPhoto} />
          )}
          
          {result.itemDescription && !result.photoUri && (
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionTitle}>What you're considering:</Text>
              <Text style={styles.descriptionText}>{result.itemDescription}</Text>
            </View>
          )}
          
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
            <Pressable style={styles.primaryButton} onPress={openShareModal}>
              <Text style={styles.primaryButtonText}>Share with Community</Text>
            </Pressable>
          </View>
        </View>

        <Modal
          visible={showShareModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowShareModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Share with Community</Text>
                <Pressable onPress={() => setShowShareModal(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </Pressable>
              </View>
              <ScrollView style={styles.modalScroll}>
                {result.photoUri && (
                  <Image source={{ uri: result.photoUri }} style={styles.sharePhoto} />
                )}
                <View style={styles.shareInfo}>
                  <Text style={styles.shareInfoLabel}>Your Mood:</Text>
                  <Text style={styles.shareInfoValue}>{result.mood}</Text>
                </View>
                <View style={styles.shareInfo}>
                  <Text style={styles.shareInfoLabel}>Decision Type:</Text>
                  <Text style={[styles.shareInfoValue, result.type === 'emotional' ? styles.emotionalColor : styles.rationalColor]}>
                    {result.type === 'emotional' ? 'Emotional' : 'Rational'}
                  </Text>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Item Name</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={shareItemName}
                    onChangeText={setShareItemName}
                    placeholder="What is it?"
                    placeholderTextColor="#666"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Ask the Community</Text>
                  <TextInput
                    style={styles.textAreaInput}
                    value={shareQuestion}
                    onChangeText={setShareQuestion}
                    placeholder="e.g., Should I buy this? What do you think?"
                    placeholderTextColor="#666"
                    multiline
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Price ($)</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={sharePrice}
                    onChangeText={setSharePrice}
                    placeholder="0.00"
                    placeholderTextColor="#666"
                    keyboardType="decimal-pad"
                  />
                </View>
                <Pressable
                  style={[styles.shareButton, (!shareQuestion.trim() || !sharePrice.trim() || !shareItemName.trim()) && styles.shareButtonDisabled]}
                  onPress={shareWithCommunity}
                  disabled={!shareQuestion.trim() || !sharePrice.trim() || !shareItemName.trim()}
                >
                  <Text style={styles.shareButtonText}>Post to Community</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </Modal>
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

        {question.type === 'photo_or_text' && (
          <View style={styles.photoOrTextContainer}>
            {!inputMethod && (
              <View style={styles.methodSelection}>
                <Text style={styles.methodPrompt}>Choose how you'd like to describe it:</Text>
                <Pressable 
                  style={styles.methodButton}
                  onPress={() => setInputMethod('photo')}
                >
                  <Text style={styles.methodIcon}>📸</Text>
                  <Text style={styles.methodButtonText}>Take a Photo</Text>
                </Pressable>
                <Pressable 
                  style={styles.methodButton}
                  onPress={() => setInputMethod('text')}
                >
                  <Text style={styles.methodIcon}>✏️</Text>
                  <Text style={styles.methodButtonText}>Describe in Words</Text>
                </Pressable>
              </View>
            )}

            {inputMethod === 'photo' && (
              <View style={styles.photoContainer}>
                {photoUri ? (
                  <View style={styles.photoPreviewContainer}>
                    <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                    <Pressable style={styles.retakeButton} onPress={() => {
                      setPhotoUri(null);
                      setInputMethod(null);
                    }}>
                      <Text style={styles.retakeButtonText}>Choose Different Method</Text>
                    </Pressable>
                    <Pressable style={styles.submitButton} onPress={handlePhotoOrTextSubmit}>
                      <Text style={styles.submitButtonText}>Continue</Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={styles.photoButtons}>
                    <Pressable style={styles.cameraButton} onPress={takePhoto}>
                      <Text style={styles.cameraIcon}>📸</Text>
                      <Text style={styles.cameraButtonText}>Take Photo</Text>
                    </Pressable>
                    <Pressable style={styles.galleryButton} onPress={pickFromGallery}>
                      <Text style={styles.cameraIcon}>🖼️</Text>
                      <Text style={styles.cameraButtonText}>Choose from Gallery</Text>
                    </Pressable>
                    <Pressable style={styles.backToMethodButton} onPress={() => setInputMethod(null)}>
                      <Text style={styles.backToMethodText}>← Back to options</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            )}

            {inputMethod === 'text' && (
              <View style={styles.textContainer}>
                <TextInput
                  style={styles.textDescriptionInput}
                  value={textDescription}
                  onChangeText={setTextDescription}
                  placeholder="Describe what you're thinking of buying... (e.g., 'New wireless headphones' or 'Designer jeans from Zara')"
                  placeholderTextColor="#666"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <Pressable style={styles.retakeButton} onPress={() => {
                  setTextDescription('');
                  setInputMethod(null);
                }}>
                  <Text style={styles.retakeButtonText}>Choose Different Method</Text>
                </Pressable>
                <Pressable 
                  style={[styles.submitButton, !textDescription.trim() && styles.submitButtonDisabled]} 
                  onPress={handlePhotoOrTextSubmit}
                  disabled={!textDescription.trim()}
                >
                  <Text style={styles.submitButtonText}>Continue</Text>
                </Pressable>
              </View>
            )}
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
    marginBottom: 40,
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
  photoOrTextContainer: {
    gap: 16,
  },
  methodSelection: {
    gap: 16,
  },
  methodPrompt: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'System',
  },
  methodButton: {
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#FFD700',
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  methodIcon: {
    fontSize: 32,
  },
  methodButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'System',
  },
  photoContainer: {
    gap: 16,
  },
  photoButtons: {
    gap: 12,
  },
  cameraButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  galleryButton: {
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#FFD700',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  cameraIcon: {
    fontSize: 28,
  },
  cameraButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'System',
  },
  backToMethodButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backToMethodText: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'System',
  },
  textContainer: {
    gap: 16,
  },
  textDescriptionInput: {
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    minHeight: 120,
    fontFamily: 'System',
  },
  photoPreviewContainer: {
    gap: 16,
  },
  photoPreview: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: '#111',
  },
  retakeButton: {
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#333',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  retakeButtonText: {
    color: '#888',
    fontSize: 15,
    fontWeight: '700',
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
  loadingEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 8,
    fontFamily: 'System',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#888',
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
  resultPhoto: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#111',
  },
  descriptionBox: {
    backgroundColor: '#0a0a0a',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    width: '100%',
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 8,
    fontFamily: 'System',
  },
  descriptionText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFD700',
    fontFamily: 'System',
  },
  closeButton: {
    fontSize: 28,
    color: '#888',
  },
  modalScroll: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  sharePhoto: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#0a0a0a',
  },
  shareInfo: {
    marginBottom: 16,
  },
  shareInfoLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 6,
    fontFamily: 'System',
  },
  shareInfoValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'System',
  },
  emotionalColor: {
    color: '#ff8844',
  },
  rationalColor: {
    color: '#FFD700',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 8,
    fontFamily: 'System',
  },
  textAreaInput: {
    backgroundColor: '#0a0a0a',
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
  priceInput: {
    backgroundColor: '#0a0a0a',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    fontFamily: 'System',
  },
  shareButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  shareButtonDisabled: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
  shareButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'System',
  },
});