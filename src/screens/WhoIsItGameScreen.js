import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { suggestedQuestions } from '../data/whoIsItQuestions';

const { height } = Dimensions.get('window');

export default function WhoIsItGameScreen({ route, navigation }) {
  const { player1, player2 } = route.params;

  // turn = 1 (P1 guesses P2's char)
  // turn = 2 (P2 guesses P1's char)
  const [turn, setTurn] = useState(1);
  
  // State for questions asked by each player
  const [p1Questions, setP1Questions] = useState([]);
  const [p2Questions, setP2Questions] = useState([]);

  // State for final guesses
  const [p1FinalGuess, setP1FinalGuess] = useState('');
  const [p2FinalGuess, setP2FinalGuess] = useState('');

  // UI States
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showGuessModal, setShowGuessModal] = useState(false);
  const [tempGuess, setTempGuess] = useState('');

  const currentQuestions = turn === 1 ? p1Questions : p2Questions;
  const setQuestions = turn === 1 ? setP1Questions : setP2Questions;
  const guesserName = turn === 1 ? player1.name : player2.name;
  const targetName = turn === 1 ? player2.name : player1.name;
  
  const MAX_QUESTIONS = 8;
  const questionsLeft = MAX_QUESTIONS - currentQuestions.length;

  // Handle Ask Question
  const handleAsk = (question) => {
    if (questionsLeft <= 0) return;
    setSelectedQuestion(question);
  };

  const recordAnswer = (answer) => {
    if (selectedQuestion) {
      setQuestions([...currentQuestions, { text: selectedQuestion.text, answer }]);
      setSelectedQuestion(null);
    }
  };

  // Handle Final Guess Submission
  const submitFinalGuess = () => {
    if (!tempGuess.trim()) return;

    if (turn === 1) {
      setP1FinalGuess(tempGuess.trim());
      setTempGuess('');
      setShowGuessModal(false);
      setTurn(2); // Switch to player 2
    } else {
      setP2FinalGuess(tempGuess.trim());
      setShowGuessModal(false);
      
      // Both turns done, go to results
      navigation.replace('WhoIsItResult', {
        player1,
        player2,
        p1FinalGuess: turn === 1 ? tempGuess.trim() : p1FinalGuess,
        p2FinalGuess: turn === 2 ? tempGuess.trim() : p2FinalGuess,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.turnText}>{guesserName}'s Turn</Text>
        <Text style={styles.targetText}>Guessing {targetName}'s secret character</Text>
        
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{questionsLeft} questions left</Text>
        </View>
      </View>

      <View style={styles.mainArea}>
        {/* LEFT COLUMN: Suggested Questions */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Suggested Questions</Text>
          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {suggestedQuestions.map((q) => {
              const isAsked = currentQuestions.some(asked => asked.text === q.text);
              return (
                <TouchableOpacity
                  key={q.id}
                  style={[styles.questionBtn, isAsked && styles.questionBtnDisabled]}
                  disabled={isAsked || questionsLeft === 0}
                  onPress={() => handleAsk(q)}
                >
                  <Text style={[styles.questionText, isAsked && styles.questionTextDisabled]}>
                    {q.text}
                  </Text>
                  {isAsked && <MaterialCommunityIcons name="check-circle-outline" size={16} color="#555" />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* RIGHT COLUMN: Asked Questions */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Your Clues</Text>
          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {currentQuestions.length === 0 ? (
              <Text style={styles.emptyText}>No questions asked yet. Pick one from the left!</Text>
            ) : (
              currentQuestions.map((q, i) => (
                <View key={i} style={styles.askedItem}>
                  <View style={[styles.answerIcon, q.answer ? styles.bgGreen : styles.bgRed]}>
                    <MaterialCommunityIcons name={q.answer ? "check" : "close"} size={20} color="#fff" />
                  </View>
                  <Text style={styles.askedText}>{q.text}</Text>
                </View>
              ))
            )}
            
            {questionsLeft === 0 && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>Out of questions! You must guess now.</Text>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.makeGuessBtn}
            onPress={() => setShowGuessModal(true)}
          >
            <LinearGradient
              colors={['#00b09b', '#96c93d']}
              style={styles.makeGuessGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <MaterialCommunityIcons name="head-question" size={24} color="#fff" />
              <Text style={styles.makeGuessText}>Make Final Guess</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Answer Modal */}
      {selectedQuestion && (
        <Modal transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Ask {targetName}:</Text>
              <Text style={styles.modalQuestion}>"{selectedQuestion.text}"</Text>
              <Text style={styles.modalSub}>What did they answer?</Text>
              
              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.answerBtn, styles.btnRed]} onPress={() => recordAnswer(false)}>
                  <MaterialCommunityIcons name="close" size={28} color="#fff" />
                  <Text style={styles.answerBtnText}>NO</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.answerBtn, styles.btnGreen]} onPress={() => recordAnswer(true)}>
                  <MaterialCommunityIcons name="check" size={28} color="#fff" />
                  <Text style={styles.answerBtnText}>YES</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setSelectedQuestion(null)}>
                <Text style={styles.cancelText}>Cancel / Pick another</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Final Guess Modal */}
      <Modal visible={showGuessModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Who Is It?</Text>
            <Text style={styles.modalSub}>Enter your final guess for {targetName}'s character.</Text>
            
            <TextInput
              style={styles.guessInput}
              placeholder="e.g. Michael Jackson"
              placeholderTextColor="#666"
              value={tempGuess}
              onChangeText={setTempGuess}
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowGuessModal(false)}>
                <Text style={styles.cancelText}>Not yet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitGuessBtn, !tempGuess.trim() && styles.submitDisabled]}
                onPress={submitFinalGuess}
                disabled={!tempGuess.trim()}
              >
                <Text style={styles.submitGuessText}>Lock It In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  turnText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  targetText: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 4,
  },
  counterBadge: {
    backgroundColor: 'rgba(0, 176, 155, 0.2)',
    borderWidth: 1,
    borderColor: '#00b09b',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 15,
  },
  counterText: {
    color: '#00b09b',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mainArea: {
    flex: 1,
    flexDirection: 'row',
    gap: 20,
  },
  column: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  columnTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
  },
  scrollArea: {
    flex: 1,
  },
  questionBtn: {
    backgroundColor: '#252525',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionBtnDisabled: {
    backgroundColor: '#151515',
    opacity: 0.6,
  },
  questionText: {
    color: '#ddd',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  questionTextDisabled: {
    color: '#666',
    textDecorationLine: 'line-through',
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
  askedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    gap: 12,
  },
  answerIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgGreen: { backgroundColor: '#4CAF50' },
  bgRed: { backgroundColor: '#F44336' },
  askedText: {
    color: '#ccc',
    fontSize: 13,
    flex: 1,
  },
  warningBox: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F44336',
    marginTop: 10,
  },
  warningText: {
    color: '#F44336',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  makeGuessBtn: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 15,
  },
  makeGuessGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 10,
  },
  makeGuessText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalTitle: {
    color: '#00b09b',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalQuestion: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 30,
  },
  modalSub: {
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 15,
  },
  answerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 8,
  },
  btnRed: { backgroundColor: '#F44336' },
  btnGreen: { backgroundColor: '#4CAF50' },
  answerBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelBtn: {
    marginTop: 20,
    padding: 15,
    alignItems: 'center',
  },
  cancelText: {
    color: '#aaa',
    fontSize: 16,
  },
  guessInput: {
    backgroundColor: '#2A2A2A',
    color: '#fff',
    padding: 18,
    borderRadius: 12,
    fontSize: 18,
    marginBottom: 25,
    textAlign: 'center',
  },
  submitGuessBtn: {
    backgroundColor: '#00b09b',
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitDisabled: {
    backgroundColor: '#333',
  },
  submitGuessText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
