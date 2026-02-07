import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';

export default function InsightsScreen() {
  const [tip, setTip] = useState('');

  const generateTip = () => {
    // Mock AI tip
    setTip(
      'Today, your Rational self performed better. Consider planning trades in advance to avoid emotional decisions.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 Insights</Text>
      <Pressable style={styles.button} onPress={generateTip}>
        <Text style={styles.buttonText}>Generate AI Tip</Text>
      </Pressable>
      {tip ? <Text style={styles.tip}>{tip}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 16 },
  tip: { fontSize: 16, textAlign: 'center', marginTop: 16 },
});