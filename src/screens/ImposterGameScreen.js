import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const REVEAL_DURATION = 3000; // 3 seconds

export default function ImposterGameScreen({ route, navigation }) {
  const { playerCount, selectedWord, imposters } = route.params;

  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [phase, setPhase] = useState('waiting'); // 'waiting' | 'revealed' | 'done'
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const timerRef = useRef(null);

  const isImposter = imposters.includes(currentPlayer);

  const handleReveal = () => {
    setPhase('revealed');

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-hide after REVEAL_DURATION
    timerRef.current = setTimeout(() => {
      hideAndAdvance();
    }, REVEAL_DURATION);
  };

  const hideAndAdvance = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // Animate out
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const nextPlayer = currentPlayer + 1;
      if (nextPlayer >= playerCount) {
        setPhase('done');
      } else {
        setCurrentPlayer(nextPlayer);
        setPhase('waiting');
      }
    });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // ===== ALL PLAYERS DONE =====
  if (phase === 'done') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#6C63FF', '#4834DF']}
          style={styles.doneIconCircle}
        >
          <MaterialCommunityIcons name="check-all" size={60} color="#fff" />
        </LinearGradient>

        <Text style={styles.doneTitle}>All Players Ready!</Text>
        <Text style={styles.doneSubtitle}>
          Everyone has seen their role.{'\n'}Start discussing — find the imposter!
        </Text>

        <View style={styles.doneInfo}>
          <MaterialCommunityIcons name="account-group" size={20} color="#6C63FF" />
          <Text style={styles.doneInfoText}>{playerCount} players</Text>
          <Text style={styles.doneDivider}>•</Text>
          <MaterialCommunityIcons name="incognito" size={20} color="#FF6B6B" />
          <Text style={styles.doneInfoText}>{imposters.length} imposter{imposters.length > 1 ? 's' : ''}</Text>
        </View>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.replace('ImposterSetup')}
        >
          <LinearGradient
            colors={['#FF6B6B', '#EE5A24']}
            style={styles.actionBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialCommunityIcons name="refresh" size={22} color="#fff" />
            <Text style={styles.actionBtnText}>New Round</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { marginTop: 12 }]}
          onPress={() => navigation.navigate('GameHub')}
        >
          <View style={styles.secondaryBtn}>
            <MaterialCommunityIcons name="home" size={22} color="#888" />
            <Text style={styles.secondaryBtnText}>Back to Games</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  // ===== REVEALED STATE =====
  if (phase === 'revealed') {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.revealCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={isImposter ? ['#FF6B6B', '#C0392B'] : ['#6C63FF', '#4834DF']}
            style={styles.revealGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {isImposter ? (
              <>
                <MaterialCommunityIcons name="incognito" size={80} color="#fff" />
                <Text style={styles.revealMainText}>YOU ARE THE</Text>
                <Text style={styles.revealBigText}>IMPOSTER</Text>
                <Text style={styles.revealHint}>Blend in. Don't get caught!</Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons name="eye-check" size={80} color="#fff" />
                <Text style={styles.revealMainText}>The word is</Text>
                <Text style={styles.revealBigText}>{selectedWord}</Text>
                <Text style={styles.revealHint}>Remember this word!</Text>
              </>
            )}
          </LinearGradient>
        </Animated.View>

        <TouchableOpacity style={styles.gotItBtn} onPress={hideAndAdvance}>
          <Text style={styles.gotItText}>Got it! Hide now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ===== WAITING STATE =====
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate('ImposterSetup')}
      >
        <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.playerIndicator}>
        <Text style={styles.playerLabel}>Player</Text>
        <Text style={styles.playerNumber}>{currentPlayer + 1}</Text>
        <Text style={styles.playerOf}>of {playerCount}</Text>
      </View>

      {/* Progress dots */}
      <View style={styles.dotsRow}>
        {Array.from({ length: playerCount }, (_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i < currentPlayer && styles.dotDone,
              i === currentPlayer && styles.dotCurrent,
            ]}
          />
        ))}
      </View>

      <Text style={styles.passText}>
        {currentPlayer === 0
          ? 'First player, tap to see your role!'
          : 'Pass the phone to the next player'}
      </Text>

      <TouchableOpacity style={styles.revealBtn} onPress={handleReveal} activeOpacity={0.8}>
        <LinearGradient
          colors={['#FF6B6B', '#EE5A24']}
          style={styles.revealBtnGradient}
        >
          <MaterialCommunityIcons name="dice-multiple" size={40} color="#fff" />
          <Text style={styles.revealBtnText}>Tap to Reveal</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.warningText}>
        ⚠️  Make sure only Player {currentPlayer + 1} is looking!
      </Text>
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

  // === Waiting Phase ===
  playerIndicator: {
    alignItems: 'center',
    marginBottom: 20,
  },
  playerLabel: {
    color: '#888',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  playerNumber: {
    color: '#FF6B6B',
    fontSize: 80,
    fontWeight: 'bold',
    lineHeight: 90,
  },
  playerOf: {
    color: '#555',
    fontSize: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2A2A2A',
  },
  dotDone: {
    backgroundColor: '#4CAF50',
  },
  dotCurrent: {
    backgroundColor: '#FF6B6B',
    width: 24,
    borderRadius: 6,
  },
  passText: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  revealBtn: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    marginBottom: 30,
  },
  revealBtnGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  revealBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  warningText: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
  },

  // === Revealed Phase ===
  revealCard: {
    width: width > 500 ? 380 : width * 0.85,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 10,
    marginBottom: 30,
  },
  revealGradient: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  revealMainText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
    marginTop: 20,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  revealBigText: {
    color: '#fff',
    fontSize: 42,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  revealHint: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginTop: 20,
    fontStyle: 'italic',
  },
  gotItBtn: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
  },
  gotItText: {
    color: '#aaa',
    fontSize: 15,
    fontWeight: '600',
  },

  // === Done Phase ===
  doneIconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  doneTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  doneSubtitle: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  doneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 35,
  },
  doneInfoText: {
    color: '#ccc',
    fontSize: 14,
  },
  doneDivider: {
    color: '#444',
    fontSize: 14,
  },
  actionBtn: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 10,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
  },
  secondaryBtnText: {
    color: '#888',
    fontSize: 16,
  },
});
