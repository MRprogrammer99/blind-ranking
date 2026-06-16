import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ref, onValue } from 'firebase/database';
import { database } from '../utils/firebase';

const { width } = Dimensions.get('window');

export default function GuestDisplayScreen({ navigation }) {
  const [liveState, setLiveState] = useState(null);

  useEffect(() => {
    const liveGameRef = ref(database, 'live_game');
    const unsubscribe = onValue(liveGameRef, (snapshot) => {
      const data = snapshot.val();
      setLiveState(data);
    });

    return () => unsubscribe();
  }, []);

  if (!liveState) {
    return (
      <View style={[styles.container, styles.centered]}>
        <MaterialCommunityIcons name="broadcast" size={60} color="#6C63FF" />
        <Text style={styles.waitingText}>Waiting for Host to start...</Text>
      </View>
    );
  }

  const { title, currentItem, currentItemIndex, totalItems, rankedSlots, isGameOver } = liveState;
  
  // Safe default for empty rankedSlots
  const safeRankedSlots = rankedSlots || {};

  const rankNumbers = Array.from({ length: totalItems || 10 }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <View style={styles.topSection}>
        {isGameOver ? (
          <View style={styles.gameOverContainer}>
            <MaterialCommunityIcons name="trophy" size={50} color="#FFD700" />
            <Text style={styles.gameOverText}>Ranking Complete!</Text>
          </View>
        ) : (
          <>
            <Text style={styles.askingText}>Currently Ranking:</Text>
            <View style={styles.currentItemCard}>
              {currentItem?.imageUri && (
                <Image 
                  source={{ uri: currentItem.imageUri }} 
                  style={styles.mainImage} 
                  resizeMode="contain"
                />
              )}
              <Text style={styles.currentItemText}>{currentItem?.name}</Text>
              <Text style={styles.progressText}>Item {currentItemIndex + 1} of {totalItems}</Text>
            </View>
          </>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.boardContainer}>
        <View style={styles.gridContainer}>
          {rankNumbers.map((num) => {
            const filledItem = safeRankedSlots[num];
            const isFilled = !!filledItem;

            return (
              <View key={num} style={[styles.gridSlot, isFilled && styles.gridSlotFilled]}>
                <View style={styles.slotNumberBadge}>
                  <Text style={styles.slotNumber}>{num}</Text>
                </View>
                
                {isFilled ? (
                  <View style={styles.slotContentFilled}>
                    {filledItem.imageUri ? (
                      <Image 
                        source={{ uri: filledItem.imageUri }} 
                        style={styles.slotThumbnail} 
                        resizeMode="cover"
                      />
                    ) : (
                      <MaterialCommunityIcons name="image-off" size={24} color="#555" style={{ marginBottom: 5 }} />
                    )}
                    <Text style={styles.slotFilledText} numberOfLines={2} adjustsFontSizeToFit>{filledItem.name}</Text>
                  </View>
                ) : (
                  <View style={styles.slotContentEmpty}>
                    <Text style={styles.slotEmptyText}>Empty</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  centered: { alignItems: 'center', justifyContent: 'center' },
  waitingText: { color: '#aaa', fontSize: 18, marginTop: 20 },
  header: { 
    padding: 15, 
    paddingTop: 50,
    backgroundColor: '#1E1E1E', 
    borderBottomWidth: 1, 
    borderBottomColor: '#2A2A2A',
    alignItems: 'center'
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  topSection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    elevation: 5,
    zIndex: 10
  },
  askingText: { color: '#aaa', fontSize: 14, marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  currentItemCard: {
    backgroundColor: '#2A2A35',
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    maxWidth: 600, // Increased max width for much bigger card
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#444'
  },
  mainImage: { 
    width: '100%', 
    height: 400, // Huge height
    resizeMode: 'contain', // Automatically keeps native aspect ratio without cropping
    backgroundColor: '#1a1a1a'
  },
  currentItemText: { 
    color: '#fff', 
    fontSize: 42, // Much bigger font
    fontWeight: 'bold', 
    textAlign: 'center',
    padding: 15,
    paddingBottom: 5
  },
  progressText: { 
    color: 'rgba(255,255,255,0.5)', 
    fontSize: 12, 
    paddingBottom: 15 
  },
  gameOverContainer: { alignItems: 'center', paddingVertical: 10 },
  gameOverText: { color: '#FFD700', fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  
  boardContainer: { padding: 15, paddingBottom: 50, alignItems: 'center' },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10, // Modern RN spacing
    width: '100%',
    maxWidth: 800,
  },
  gridSlot: {
    width: '18%', // Fits exactly 5 per row with gap
    minWidth: 80,
    aspectRatio: 0.8, // Slightly taller than wide
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    alignItems: 'center',
    padding: 8,
    position: 'relative',
    overflow: 'hidden'
  },
  gridSlotFilled: {
    backgroundColor: '#1A2622',
    borderColor: '#2D4A3E',
  },
  slotNumberBadge: {
    position: 'absolute',
    top: -5,
    left: -5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 2,
    borderColor: '#121212'
  },
  slotNumber: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  
  slotContentEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  slotEmptyText: { color: '#555', fontSize: 14, fontStyle: 'italic' },
  
  slotContentFilled: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 15,
  },
  slotThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
    backgroundColor: '#111'
  },
  slotFilledText: { 
    color: '#6BCB77', 
    fontSize: 14, 
    fontWeight: 'bold',
    textAlign: 'center'
  },
});
