import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function WhoIsItResultScreen({ route, navigation }) {
  const { player1, player2, p1FinalGuess, p2FinalGuess } = route.params;

  // Simple string comparison for matching
  const p1Correct = p1FinalGuess.toLowerCase() === player2.character.toLowerCase();
  const p2Correct = p2FinalGuess.toLowerCase() === player1.character.toLowerCase();

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      <Text style={styles.title}>Game Over!</Text>

      {/* Player 1 Result */}
      <View style={[styles.resultCard, p1Correct ? styles.borderGreen : styles.borderRed]}>
        <Text style={styles.playerName}>{player1.name}'s Guess</Text>
        <Text style={styles.targetText}>Target: {player2.character}</Text>
        <Text style={styles.guessText}>Guessed: {p1FinalGuess}</Text>
        
        <View style={[styles.badge, p1Correct ? styles.bgGreen : styles.bgRed]}>
          <MaterialCommunityIcons name={p1Correct ? "check" : "close"} size={20} color="#fff" />
          <Text style={styles.badgeText}>{p1Correct ? "CORRECT" : "WRONG"}</Text>
        </View>
      </View>

      {/* Player 2 Result */}
      <View style={[styles.resultCard, p2Correct ? styles.borderGreen : styles.borderRed]}>
        <Text style={styles.playerName}>{player2.name}'s Guess</Text>
        <Text style={styles.targetText}>Target: {player1.character}</Text>
        <Text style={styles.guessText}>Guessed: {p2FinalGuess}</Text>
        
        <View style={[styles.badge, p2Correct ? styles.bgGreen : styles.bgRed]}>
          <MaterialCommunityIcons name={p2Correct ? "check" : "close"} size={20} color="#fff" />
          <Text style={styles.badgeText}>{p2Correct ? "CORRECT" : "WRONG"}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.playAgainBtn} 
        activeOpacity={0.8}
        onPress={() => navigation.popToTop()} // Go back to Hub
      >
        <LinearGradient
          colors={['#00b09b', '#96c93d']}
          style={styles.btnGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <MaterialCommunityIcons name="home" size={24} color="#fff" />
          <Text style={styles.playAgainText}>Back to Hub</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  resultCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 20,
    alignItems: 'center',
  },
  borderGreen: { borderColor: '#4CAF50' },
  borderRed: { borderColor: '#F44336' },
  playerName: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 10,
  },
  targetText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  guessText: {
    color: '#ccc',
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  bgGreen: { backgroundColor: '#4CAF50' },
  bgRed: { backgroundColor: '#F44336' },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  playAgainBtn: {
    width: '100%',
    maxWidth: 400,
    marginTop: 30,
    borderRadius: 16,
    overflow: 'hidden',
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 10,
  },
  playAgainText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
