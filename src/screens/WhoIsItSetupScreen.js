import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function WhoIsItSetupScreen({ navigation }) {
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player1Character, setPlayer1Character] = useState('');
  
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [player2Character, setPlayer2Character] = useState('');

  const handleStartGame = () => {
    if (!player1Character.trim() || !player2Character.trim()) {
      Alert.alert('Missing Characters', 'Both players need to enter a secret character to play!');
      return;
    }

    navigation.replace('WhoIsItGame', {
      player1: { name: player1Name, character: player1Character.trim() },
      player2: { name: player2Name, character: player2Character.trim() },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>

        <LinearGradient
          colors={['#00b09b', '#96c93d']}
          style={styles.iconCircle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialCommunityIcons name="help" size={60} color="#fff" />
        </LinearGradient>

        <Text style={styles.title}>Who Is It?</Text>
        <Text style={styles.subtitle}>Enter your secret characters</Text>

        <View style={styles.playerSection}>
          <Text style={styles.sectionTitle}>Player 1</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Your Name (e.g. Alice)"
            placeholderTextColor="#666"
            value={player1Name}
            onChangeText={setPlayer1Name}
          />
          <TextInput
            style={styles.secretInput}
            placeholder="Secret Character (e.g. Mr. Bean)"
            placeholderTextColor="#666"
            value={player1Character}
            onChangeText={setPlayer1Character}
            secureTextEntry // Hides the text so the other player can't see
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.playerSection}>
          <Text style={styles.sectionTitle}>Player 2</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Your Name (e.g. Bob)"
            placeholderTextColor="#666"
            value={player2Name}
            onChangeText={setPlayer2Name}
          />
          <TextInput
            style={styles.secretInput}
            placeholder="Secret Character (e.g. Michael Jackson)"
            placeholderTextColor="#666"
            value={player2Character}
            onChangeText={setPlayer2Character}
            secureTextEntry // Hides the text
          />
        </View>

        <TouchableOpacity style={styles.startBtn} onPress={handleStartGame} activeOpacity={0.8}>
          <LinearGradient
            colors={['#00b09b', '#96c93d']}
            style={styles.startBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialCommunityIcons name="play-circle" size={24} color="#fff" />
            <Text style={styles.startBtnText}>Start Guessing!</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.rulesBox}>
          <Text style={styles.rulesTitle}>How to Play</Text>
          <Text style={styles.ruleItem}>1️⃣  Both players enter a secret character.</Text>
          <Text style={styles.ruleItem}>2️⃣  Take turns guessing each other's character.</Text>
          <Text style={styles.ruleItem}>3️⃣  You can only ask 8 Yes/No questions.</Text>
          <Text style={styles.ruleItem}>4️⃣  Use the suggested questions to narrow it down!</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#121212',
  },
  container: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
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
    zIndex: 10,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    marginBottom: 30,
  },
  playerSection: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  sectionTitle: {
    color: '#00b09b',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  nameInput: {
    backgroundColor: '#252525',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  secretInput: {
    backgroundColor: '#252525',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderColor: '#FF6B6B',
    borderWidth: 1,
  },
  divider: {
    height: 1,
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#333',
    marginVertical: 20,
  },
  startBtn: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 30,
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
    maxWidth: 400,
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
    lineHeight: 22,
  },
});
