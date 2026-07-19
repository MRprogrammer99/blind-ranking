import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import movieBank from '../data/movieBank';

const { width } = Dimensions.get('window');

export default function GuessMovieScreen({ navigation }) {
  const [currentMovie, setCurrentMovie] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const revealMovie = () => {
    const randomIndex = Math.floor(Math.random() * movieBank.length);
    setCurrentMovie(movieBank[randomIndex]);
    setIsRevealed(true);
  };

  const nextMovie = () => {
    setIsRevealed(false);
    setCurrentMovie(null);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Guess the Movie</Text>
      <Text style={styles.subtitle}>Act it out, draw it, or describe it!</Text>

      <View style={styles.gameArea}>
        {!isRevealed ? (
          <TouchableOpacity style={styles.revealBtn} onPress={revealMovie} activeOpacity={0.8}>
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              style={styles.revealBtnGradient}
            >
              <MaterialCommunityIcons name="movie-open-outline" size={50} color="#fff" />
              <Text style={styles.revealBtnText}>Tap to Reveal</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.revealedContainer}>
            <LinearGradient
              colors={['#2A2A2A', '#1A1A1A']}
              style={styles.movieCard}
            >
              <MaterialCommunityIcons name="movie" size={40} color="#FFA500" style={styles.movieIcon} />
              <Text style={styles.movieText}>{currentMovie}</Text>
            </LinearGradient>

            <TouchableOpacity style={styles.nextBtn} onPress={nextMovie}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.nextBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.nextBtnText}>Next Movie</Text>
                <MaterialCommunityIcons name="arrow-right" size={24} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
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
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  gameArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  revealBtn: {
    width: 220,
    height: 220,
    borderRadius: 110,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  revealBtnGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  revealBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  revealedContainer: {
    width: '100%',
    alignItems: 'center',
  },
  movieCard: {
    width: width > 500 ? 400 : width * 0.9,
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    minHeight: 250,
    borderWidth: 1,
    borderColor: '#333',
  },
  movieIcon: {
    marginBottom: 20,
  },
  movieText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 45,
  },
  nextBtn: {
    width: width > 500 ? 300 : width * 0.8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  nextBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 10,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
