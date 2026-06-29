import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { loadGames, saveGames } from '../utils/storage';

export default function CreateGameScreen({ navigation, route }) {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const editingGame = route.params?.gameToEdit;

  useEffect(() => {
    if (editingGame) {
      setTitle(editingGame.title);
      setItems(editingGame.items);
    }
  }, [editingGame]);

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const newItem = {
      id: Date.now().toString() + Math.random().toString(),
      name: newItemName.trim(),
      imageUri: null
    };
    setItems([...items, newItem]);
    setNewItemName('');
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const moveItemUp = (index) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
  };

  const moveItemDown = (index) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
  };

  const pickAndUploadImage = async (itemId) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.2,
        base64: true,
      });

      if (!result.canceled) {
        setIsUploading(true);
        const asset = result.assets[0];
        
        let dataUrl = null;
        
        if (asset.base64) {
           const mimeType = asset.mimeType || 'image/jpeg';
           dataUrl = `data:${mimeType};base64,${asset.base64}`;
        } else {
           const response = await fetch(asset.uri);
           const blob = await response.blob();
           dataUrl = await new Promise((resolve, reject) => {
             const reader = new FileReader();
             reader.onloadend = () => resolve(reader.result);
             reader.onerror = reject;
             reader.readAsDataURL(blob);
           });
        }
        
        // Save image directly as Base64 data URL to Realtime Database
        setItems(currentItems => currentItems.map(item => 
          item.id === itemId ? { ...item, imageUri: dataUrl } : item
        ));
        
        setIsUploading(false);
      }
    } catch (e) {
      console.error('Image upload error:', e);
      Alert.alert('Upload Failed', 'There was an error attaching the image.');
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a game title.');
      return;
    }
    if (items.length < 2) {
      Alert.alert('Error', 'Please add at least 2 items to rank.');
      return;
    }

    const games = await loadGames();
    
    if (editingGame) {
      const updatedGames = games.map(g => 
        g.id === editingGame.id ? { ...g, title, items } : g
      );
      await saveGames(updatedGames);
    } else {
      const newGame = {
        id: Date.now().toString(),
        title,
        items
      };
      await saveGames([...games, newGame]);
    }
    
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{editingGame ? 'Edit Game' : 'Create Game'}</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn} disabled={isUploading}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {isUploading && (
        <View style={styles.uploadOverlay}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.uploadText}>Uploading Image...</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.label}>Game Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Top 10 Marvel Movies"
          placeholderTextColor="#666"
          value={title}
          onChangeText={setTitle}
        />

        <View style={styles.addItemSection}>
          <Text style={styles.label}>Add Items (Order matters!)</Text>
          <Text style={styles.subLabel}>The order below is exactly how they will be shown to the guest.</Text>
          <View style={styles.addRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Item name (e.g., Iron Man)"
              placeholderTextColor="#666"
              value={newItemName}
              onChangeText={setNewItemName}
              onSubmitEditing={handleAddItem}
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddItem}>
              <MaterialCommunityIcons name="plus" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={items}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No items added yet.</Text>}
          renderItem={({ item, index }) => (
            <View style={styles.itemCard}>
              <View style={styles.itemOrderControls}>
                <TouchableOpacity onPress={() => moveItemUp(index)} disabled={index === 0}>
                  <MaterialCommunityIcons name="chevron-up" size={28} color={index === 0 ? '#444' : '#6C63FF'} />
                </TouchableOpacity>
                <Text style={styles.itemIndex}>{index + 1}</Text>
                <TouchableOpacity onPress={() => moveItemDown(index)} disabled={index === items.length - 1}>
                  <MaterialCommunityIcons name="chevron-down" size={28} color={index === items.length - 1 ? '#444' : '#6C63FF'} />
                </TouchableOpacity>
              </View>
              
              {item.imageUri && (
                <Image source={{ uri: item.imageUri }} style={styles.itemThumbnail} />
              )}
              
              <Text style={styles.itemName}>{item.name}</Text>
              
              <TouchableOpacity onPress={() => pickAndUploadImage(item.id)} style={styles.actionBtn}>
                <MaterialCommunityIcons name={item.imageUri ? "image-edit" : "image-plus"} size={22} color="#6C63FF" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.actionBtn}>
                <MaterialCommunityIcons name="close-circle" size={22} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </KeyboardAvoidingView>
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
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  saveBtn: { padding: 5, paddingHorizontal: 10, backgroundColor: '#6C63FF', borderRadius: 8 },
  saveText: { color: '#fff', fontWeight: 'bold' },
  content: { flex: 1, padding: 20 },
  label: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  subLabel: { color: '#aaa', fontSize: 13, marginBottom: 15 },
  input: { 
    backgroundColor: '#1E1E1E', 
    color: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 25, 
    borderWidth: 1, 
    borderColor: '#2A2A2A' 
  },
  addItemSection: { marginBottom: 20 },
  addRow: { flexDirection: 'row', alignItems: 'center' },
  addBtn: { 
    backgroundColor: '#6C63FF', 
    width: 50, 
    height: 50, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginLeft: 10
  },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 30, fontSize: 16 },
  itemCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1E1E1E', 
    borderRadius: 10, 
    marginBottom: 10,
    paddingRight: 5
  },
  itemOrderControls: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 10, 
    borderRightWidth: 1, 
    borderRightColor: '#2A2A2A',
    paddingVertical: 5
  },
  itemIndex: { color: '#aaa', fontSize: 12, fontWeight: 'bold' },
  itemThumbnail: { width: 40, height: 40, borderRadius: 5, marginLeft: 10 },
  itemName: { flex: 1, color: '#fff', fontSize: 16, paddingLeft: 10 },
  actionBtn: { padding: 10 },
  uploadOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadText: { color: '#fff', marginTop: 10, fontSize: 16, fontWeight: 'bold' }
});
