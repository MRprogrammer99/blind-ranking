import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { loadGames, saveGames } from '../utils/storage';
import { useIsFocused } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [games, setGames] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchGames();
    }
  }, [isFocused]);

  const fetchGames = async () => {
    const data = await loadGames();
    setGames(data);
  };

  const deleteGame = (id) => {
    Alert.alert('Delete Game', 'Are you sure you want to delete this game?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updatedGames = games.filter(g => g.id !== id);
          await saveGames(updatedGames);
          setGames(updatedGames);
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Blind Ranking</Text>
      </View>

      <FlatList
        data={games}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="format-list-numbered" size={60} color="#555" />
            <Text style={styles.emptyText}>No ranking games created yet.</Text>
            <Text style={styles.emptySubText}>Tap the + button to create one!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('GamePlay', { gameId: item.id })}
          >
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSub}>{item.items.length} Items to Rank</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => navigation.navigate('CreateGame', { gameToEdit: item })} style={styles.actionBtn}>
                <MaterialCommunityIcons name="pencil-outline" size={24} color="#aaa" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteGame(item.id)} style={styles.actionBtn}>
                <MaterialCommunityIcons name="delete-outline" size={24} color="#FF6B6B" />
              </TouchableOpacity>
              <View style={styles.playBtn}>
                <MaterialCommunityIcons name="play" size={28} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('CreateGame')}
      >
        <MaterialCommunityIcons name="plus" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { 
    padding: 20, 
    paddingTop: 50,
    backgroundColor: '#1E1E1E', 
    borderBottomWidth: 1, 
    borderBottomColor: '#2A2A2A',
    alignItems: 'center'
  },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  listContainer: { padding: 15, paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  emptySubText: { color: '#aaa', fontSize: 14, marginTop: 10 },
  card: { 
    backgroundColor: '#1E1E1E', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cardInfo: { flex: 1 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  cardSub: { color: '#888', fontSize: 14 },
  cardActions: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: { padding: 8, marginRight: 5 },
  playBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5
  },
  fab: { 
    position: 'absolute', 
    width: 60, 
    height: 60, 
    alignItems: 'center', 
    justifyContent: 'center', 
    right: 20, 
    bottom: 30, 
    backgroundColor: '#6C63FF', 
    borderRadius: 30, 
    elevation: 5 
  },
});
