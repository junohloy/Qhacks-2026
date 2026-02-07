import { View, Text, StyleSheet } from 'react-native';

export default function RewardsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏅 Rewards</Text>
      <Text style={styles.text}>
        This is where your Solana NFT badges or achievements will appear.
      </Text>
      <Text style={styles.note}>
        Example: “Rational Trader of the Day” NFT if Rational P&L greater Emotional P&L
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  text: { fontSize: 16, textAlign: 'center' },
  note: { fontSize: 14, color: '#888', marginTop: 12, textAlign: 'center' },
});