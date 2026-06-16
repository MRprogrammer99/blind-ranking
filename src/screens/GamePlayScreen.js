import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { loadGames } from '../utils/storage';
import { ref, set } from 'firebase/database';
import { database } from '../utils/firebase';

export default function GamePlayScreen({ navigation, route }) {
  const { gameId } = route.params;
  const [game, setGame] = useState(null);
  
  // State for gameplay
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [rankedSlots, setRankedSlots] = useState({}); // e.g., { 1: {name: "Iron Man", imageUri: "..."}, ... }
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    fetchGame();
  }, []);

  const fetchGame = async () => {
    const games = await loadGames();
    const foundGame = games.find(g => g.id === gameId);
    if (foundGame) {
      setGame(foundGame);
    } else {
      Alert.alert('Error', 'Game not found');
      navigation.goBack();
    }
  };

  // Handle connection lifecycle (closing the game manually or closing tab)
  useEffect(() => {
    if (game) {
      const liveGameRef = ref(database, 'live_game');
      // Tells Firebase server to delete the node if the user's connection drops
      import('firebase/database').then(({ onDisconnect, remove }) => {
        onDisconnect(liveGameRef).remove();
      });

      return () => {
        // Automatically delete the node when clicking the back button
        import('firebase/database').then(({ remove, onDisconnect }) => {
          remove(liveGameRef);
          onDisconnect(liveGameRef).cancel();
        });
      };
    }
  }, [game]);

  // Broadcast state to Firebase whenever it changes
  useEffect(() => {
    if (game) {
      const liveGameRef = ref(database, 'live_game');
      set(liveGameRef, {
        gameId: game.id,
        title: game.title,
        totalItems: game.items.length,
        currentItem: game.items[currentItemIndex] || null,
        currentItemIndex,
        rankedSlots,
        isGameOver
      }).catch(err => console.error("Firebase broadcast error:", err));
    }
  }, [game, currentItemIndex, rankedSlots, isGameOver]);

  if (!game) return <View style={styles.container} />;

  const totalItems = game.items.length;
  const currentItem = game.items[currentItemIndex];

  const handleSelectRank = (rankNumber) => {
    // If rank is already taken, ignore
    if (rankedSlots[rankNumber]) return;

    // Assign full item object to rank
    const newRankedSlots = { ...rankedSlots, [rankNumber]: currentItem };
    setRankedSlots(newRankedSlots);

    // Move to next item or end game
    if (currentItemIndex < totalItems - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    } else {
      setIsGameOver(true);
    }
  };

  const resetGame = () => {
    setRankedSlots({});
    setCurrentItemIndex(0);
    setIsGameOver(false);
  };

  // Generate an array from 1 to N
  const rankNumbers = Array.from({ length: totalItems }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{game.title}</Text>
        <TouchableOpacity onPress={resetGame} style={styles.resetBtn}>
          <MaterialCommunityIcons name="refresh" size={24} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      <View style={styles.topSection}>
        {isGameOver ? (
          <View style={styles.gameOverContainer}>
            <MaterialCommunityIcons name="trophy" size={50} color="#FFD700" />
            <Text style={styles.gameOverText}>Ranking Complete!</Text>
          </View>
        ) : (
          <>
            <Text style={styles.askingText}>Ask Guest to Rank:</Text>
            <View style={styles.currentItemCard}>
              {currentItem?.imageUri && (
                <Image source={{ uri: currentItem.imageUri }} style={styles.mainImage} />
              )}
              <Text style={styles.currentItemText}>{currentItem?.name}</Text>
              <Text style={styles.progressText}>Item {currentItemIndex + 1} of {totalItems}</Text>
            </View>
          </>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.boardContainer}>
        {rankNumbers.map((num) => {
          const filledItem = rankedSlots[num];
          const isFilled = !!filledItem;

          return (
            <View key={num} style={[styles.slotCard, isFilled && styles.slotCardFilled]}>
              <View style={styles.slotNumberBadge}>
                <Text style={styles.slotNumber}>{num}</Text>
              </View>
              
              <View style={styles.slotContent}>
                {isFilled ? (
                  <View style={styles.filledRow}>
                    {filledItem.imageUri && (
                      <Image source={{ uri: filledItem.imageUri }} style={styles.thumbnailImage} />
                    )}
                    <Text style={styles.slotFilledText}>{filledItem.name}</Text>
                  </View>
                ) : (
                  <Text style={styles.slotEmptyText}>Empty</Text>
                )}
              </View>

              {!isGameOver && !isFilled && (
                <TouchableOpacity 
                  style={styles.selectBtn} 
                  onPress={() => handleSelectRank(num)}
                >
                  <Text style={styles.selectBtnText}>Select</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 15, 
    paddingTop: 50,
    backgroundColor: '#1E1E1E', 
    borderBottomWidth: 1, 
    borderBottomColor: '#2A2A2A'
  },
  backBtn: { padding: 5 },
  resetBtn: { padding: 5 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  topSection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    elevation: 5,
    zIndex: 10
  },
  askingText: { color: '#aaa', fontSize: 14, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  currentItemCard: {
    backgroundColor: '#6C63FF',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  mainImage: { width: 120, height: 160, borderRadius: 10, marginBottom: 15 },
  currentItemText: { color: '#fff', fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
  progressText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 10 },
  
  gameOverContainer: { alignItems: 'center', paddingVertical: 10 },
  gameOverText: { color: '#FFD700', fontSize: 24, fontWeight: 'bold', marginTop: 10 },

  boardContainer: { padding: 15, paddingBottom: 50 },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  slotCardFilled: {
    backgroundColor: '#1A2622', 
    borderColor: '#2D4A3E',
  },
  slotNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  slotNumber: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  slotContent: { flex: 1 },
  filledRow: { flexDirection: 'row', alignItems: 'center' },
  thumbnailImage: { width: 30, height: 30, borderRadius: 15, marginRight: 10 },
  slotEmptyText: { color: '#555', fontSize: 16, fontStyle: 'italic' },
  slotFilledText: { color: '#6BCB77', fontSize: 18, fontWeight: 'bold' },
  
  selectBtn: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  selectBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
