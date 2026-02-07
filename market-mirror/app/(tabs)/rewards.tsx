import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';

export default function RewardsScreen() {
  const [mood, setMood] = useState<'Neutral' | 'Happy' | 'Stressed'>('Neutral');
  const [nftAward, setNftAward] = useState(false);

  const analyzeMood = () => {
    // Mock face landmark mood detection
    const moods: ('Neutral' | 'Happy' | 'Stressed')[] = ['Neutral', 'Happy', 'Stressed'];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    setMood(randomMood);

    // Example Solana NFT condition
    if (randomMood === 'Happy') setNftAward(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏅 Mood & Rewards</Text>
      <Pressable style={styles.button} onPress={analyzeMood}>
        <Text style={styles.buttonText}>Analyze Mood</Text>
      </Pressable>
      <Text style={styles.text}>Detected Mood: {mood}</Text>
      {nftAward && <Text style={styles.nft}>🎉 NFT Awarded on Solana!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  button: { backgroundColor: '#000', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 8, marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 16 },
  text: { fontSize: 18, marginTop: 12 },
  nft: { fontSize: 20, color: '#ffb400', marginTop: 16, fontWeight: 'bold' },
});