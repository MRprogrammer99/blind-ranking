import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import wordBank from '../data/wordBank';

export default function ImposterSetupScreen({ navigation }) {
  const [playerCount, setPlayerCount] = useState(4);

  const startGame = () => {
    // Pick a random word
    const randomIndex = Math.floor(Math.random() * wordBank.length);
    const selectedWord = wordBank[randomIndex];

    // Pick random imposter(s): 1 imposter for 3-5, optionally 2 for 6-8
    const imposterCount = playerCount >= 6 ? (Math.random() > 0.5 ? 2 : 1) : 1;
    
    // Create array of player indices and shuffle to pick imposters
    const playerIndices = Array.from({ length: playerCount }, (_, i) => i);
    const imposters = new Set();
    while (imposters.size < imposterCount) {
      const randIdx = Math.floor(Math.random() * playerCount);
      imposters.add(playerIndices[randIdx]);
    }

    navigation.replace('ImposterGame', {
      playerCount,
      selectedWord,
      imposters: Array.from(imposters),
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
      </TouchableOpacity>

      <LinearGradient
        colors={['#FF6B6B', '#EE5A24']}
        style={styles.iconCircle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <MaterialCommunityIcons name="incognito" size={60} color="#fff" />
      </LinearGradient>

      <Text style={styles.title}>Imposter</Text>
      <Text style={styles.subtitle}>How many players?</Text>

      <View style={styles.counterRow}>
        <TouchableOpacity
          style={[styles.counterBtn, playerCount <= 3 && styles.counterBtnDisabled]}
          onPress={() => setPlayerCount(Math.max(3, playerCount - 1))}
          disabled={playerCount <= 3}
        >
          <MaterialCommunityIcons name="minus" size={28} color={playerCount <= 3 ? '#444' : '#fff'} />
        </TouchableOpacity>

        <View style={styles.countDisplay}>
          <Text style={styles.countNumber}>{playerCount}</Text>
          <Text style={styles.countLabel}>players</Text>
        </View>

        <TouchableOpacity
          style={[styles.counterBtn, playerCount >= 8 && styles.counterBtnDisabled]}
          onPress={() => setPlayerCount(Math.min(8, playerCount + 1))}
          disabled={playerCount >= 8}
        >
          <MaterialCommunityIcons name="plus" size={28} color={playerCount >= 8 ? '#444' : '#fff'} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="information-outline" size={18} color="#888" />
        <Text style={styles.infoText}>
          {playerCount >= 6
            ? '1 or 2 imposters will be randomly chosen'
            : '1 imposter will be randomly chosen'}
        </Text>
      </View>

      <TouchableOpacity style={styles.startBtn} onPress={startGame} activeOpacity={0.8}>
        <LinearGradient
          colors={['#FF6B6B', '#EE5A24']}
          style={styles.startBtnGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <MaterialCommunityIcons name="dice-multiple" size={24} color="#fff" />
          <Text style={styles.startBtnText}>Start Game</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.rulesBox}>
        <Text style={styles.rulesTitle}>How to Play</Text>
        <Text style={styles.ruleItem}>🎲  Pass the phone to each player</Text>
        <Text style={styles.ruleItem}>👀  Each player taps to see their role</Text>
        <Text style={styles.ruleItem}>🕵️  The imposter sees "IMPOSTER" instead of the word</Text>
        <Text style={styles.ruleItem}>🗣️  Discuss and find who the imposter is!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    color: '#888',
    fontSize: 18,
    marginBottom: 35,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 25,
    marginBottom: 15,
  },
  counterBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  counterBtnDisabled: {
    backgroundColor: '#1A1A1A',
    borderColor: '#222',
  },
  countDisplay: {
    alignItems: 'center',
    minWidth: 80,
  },
  countNumber: {
    color: '#FF6B6B',
    fontSize: 56,
    fontWeight: 'bold',
  },
  countLabel: {
    color: '#888',
    fontSize: 14,
    marginTop: -5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 30,
  },
  infoText: {
    color: '#888',
    fontSize: 13,
  },
  startBtn: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 40,
    elevation: 5,
  },
  startBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 10,
  },
  startBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  rulesBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  rulesTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ruleItem: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
});
