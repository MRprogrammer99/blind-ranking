import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAq5J0Fa0kzQ-r_lFMQ4R42NjKawrEJU9k",
  authDomain: "blind-ranking-5c5fa.firebaseapp.com",
  databaseURL: "https://blind-ranking-5c5fa-default-rtdb.firebaseio.com",
  projectId: "blind-ranking-5c5fa",
  storageBucket: "blind-ranking-5c5fa.firebasestorage.app",
  messagingSenderId: "791938096916",
  appId: "1:791938096916:web:82ae762ca627883af36c01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and Storage
export const database = getDatabase(app);
export const storage = getStorage(app);
