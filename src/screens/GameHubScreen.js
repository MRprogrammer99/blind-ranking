import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const games = [
  {
    id: 'blind-ranking',
    title: 'Blind Ranking',
    description: 'Rank options blindly and see what everyone really thinks',
    icon: 'trophy',
    gradient: ['#6C63FF', '#4834DF'],
    players: '2+',
    route: 'ModeSelect',
    available: true,
  },
  {
    id: 'imposter',
    title: 'Imposter',
    description: 'Find the spy hiding among you',
    icon: 'incognito',
    gradient: ['#FF6B6B', '#EE5A24'],
    players: '3-8',
    route: 'ImposterSetup',
    available: true,
  },
];

export default function GameHubScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <MaterialCommunityIcons name="gamepad-variant" size={50} color="#6C63FF" />
        <Text style={styles.title}>Party Games</Text>
        <Text style={styles.subtitle}>Pick a game and let the fun begin!</Text>
      </View>

      <View style={styles.gamesGrid}>
        {games.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={styles.gameCard}
            activeOpacity={game.available ? 0.7 : 1}
            onPress={() => {
              if (game.available) {
                navigation.navigate(game.route);
              }
            }}
          >
            <LinearGradient
              colors={game.available ? game.gradient : ['#333', '#222']}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardIconWrap}>
                <MaterialCommunityIcons
                  name={game.icon}
                  size={48}
                  color={game.available ? '#fff' : '#555'}
                />
              </View>
              <Text style={[styles.gameTitle, !game.available && { color: '#555' }]}>
                {game.title}
              </Text>
              <Text style={[styles.gameDesc, !game.available && { color: '#444' }]}>
                {game.description}
              </Text>
              <View style={styles.playerBadge}>
                <MaterialCommunityIcons name="account-group" size={16} color={game.available ? '#fff' : '#555'} />
                <Text style={[styles.playerText, !game.available && { color: '#555' }]}>
                  {game.players} Players
                </Text>
              </View>
              {!game.available && (
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>COMING SOON</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        ))}
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
  headerSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    color: '#fff',
    fontSize: 38,
    fontWeight: 'bold',
    marginTop: 15,
    letterSpacing: 1,
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    marginTop: 8,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    maxWidth: 700,
  },
  gameCard: {
    width: width > 500 ? 300 : width * 0.85,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardGradient: {
    padding: 28,
    alignItems: 'center',
    minHeight: 220,
    justifyContent: 'center',
  },
  cardIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  gameTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  gameDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  playerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  playerText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  comingSoonText: {
    color: '#666',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
