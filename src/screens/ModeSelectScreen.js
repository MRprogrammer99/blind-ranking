import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ModeSelectScreen({ navigation }) {
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');
  
  // Hardcoded secure PIN for the host
  const SECRET_PIN = "1234";

  const handleHostPress = () => {
    setShowPinInput(true);
  };

  const handleGuestPress = () => {
    navigation.navigate('GuestDisplay');
  };

  const verifyPin = () => {
    if (pin === SECRET_PIN) {
      setPin('');
      setShowPinInput(false);
      navigation.navigate('Home');
    } else {
      Alert.alert('Access Denied', 'Incorrect PIN code.');
      setPin('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blind Ranking</Text>
      <Text style={styles.subtitle}>Select your mode to continue</Text>

      {showPinInput ? (
        <View style={styles.pinContainer}>
          <Text style={styles.pinLabel}>Enter Host PIN:</Text>
          <TextInput
            style={styles.pinInput}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            value={pin}
            onChangeText={setPin}
            autoFocus
          />
          <View style={styles.pinActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowPinInput(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={verifyPin}>
              <Text style={styles.submitText}>Enter</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.modeBtn} onPress={handleHostPress}>
            <MaterialCommunityIcons name="shield-account" size={40} color="#fff" />
            <View style={styles.modeTextContainer}>
              <Text style={styles.modeTitle}>I am the Host</Text>
              <Text style={styles.modeDesc}>Control the game (Requires PIN)</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.modeBtn, styles.guestBtn]} onPress={handleGuestPress}>
            <MaterialCommunityIcons name="monitor-eye" size={40} color="#fff" />
            <View style={styles.modeTextContainer}>
              <Text style={styles.modeTitle}>I am the Guest</Text>
              <Text style={styles.modeDesc}>Join the live broadcast</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { color: '#aaa', fontSize: 16, marginBottom: 50 },
  buttonsContainer: { width: '100%', maxWidth: 400 },
  modeBtn: { 
    backgroundColor: '#6C63FF', 
    borderRadius: 15, 
    padding: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20,
    elevation: 5
  },
  guestBtn: { backgroundColor: '#2D4A3E' },
  modeTextContainer: { marginLeft: 20, flex: 1 },
  modeTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  modeDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4 },
  
  pinContainer: { width: '100%', maxWidth: 300, backgroundColor: '#1E1E1E', padding: 20, borderRadius: 15 },
  pinLabel: { color: '#fff', fontSize: 18, marginBottom: 15, textAlign: 'center' },
  pinInput: { 
    backgroundColor: '#2A2A2A', 
    color: '#fff', 
    fontSize: 24, 
    textAlign: 'center', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 20,
    letterSpacing: 10
  },
  pinActions: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { padding: 15, flex: 1, alignItems: 'center' },
  cancelText: { color: '#aaa', fontSize: 16 },
  submitBtn: { backgroundColor: '#6C63FF', padding: 15, borderRadius: 10, flex: 1, alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
