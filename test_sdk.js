const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyAq5J0Fa0kzQ-r_lFMQ4R42NjKawrEJU9k",
  authDomain: "blind-ranking-5c5fa.firebaseapp.com",
  projectId: "blind-ranking-5c5fa",
  storageBucket: "blind-ranking-5c5fa.firebasestorage.app",
  messagingSenderId: "791938096916",
  appId: "1:791938096916:web:82ae762ca627883af36c01"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const liveGameRef = ref(database, 'live_game');
set(liveGameRef, {
  gameId: '123',
  title: 'test',
  totalItems: 10,
  currentItem: { id: 'abc', name: 'Iron Man', imageUri: null },
  currentItemIndex: 0,
  rankedSlots: {},
  isGameOver: false
}).then(() => console.log('SUCCESS')).catch(console.error);
