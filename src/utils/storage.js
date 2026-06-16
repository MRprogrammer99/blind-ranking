import { ref, get, set } from 'firebase/database';
import { database } from './firebase';

const DEFAULT_GAMES = [
  {
    id: 'game-1',
    title: 'Top 10 Most Handsome Actors of 2026 | Blind Ranking',
    items: [
      { id: 'item-1-1', name: 'Ashok Selvan' },
      { id: 'item-1-2', name: 'Kavin' },
      { id: 'item-1-3', name: 'Kalidas Jayaram' },
      { id: 'item-1-4', name: 'Atharvaa' },
      { id: 'item-1-5', name: 'Dulquer Salmaan' },
      { id: 'item-1-6', name: 'Gautham Karthik' },
      { id: 'item-1-7', name: 'Arjun Das' },
      { id: 'item-1-8', name: 'Dhruv Vikram' },
      { id: 'item-1-9', name: 'Sivakarthikeyan' },
      { id: 'item-1-10', name: 'Harish Kalyan' }
    ]
  },
  {
    id: 'game-2',
    title: 'Blind Ranking: Top 10 Actor Body Transformations',
    items: [
      { id: 'item-2-1', name: 'Soori — Mandaadi' },
      { id: 'item-2-2', name: 'Arya — Sarpatta Parambarai' },
      { id: 'item-2-3', name: 'Suriya — Vaaranam Aayiram' },
      { id: 'item-2-4', name: 'Vikram — I' },
      { id: 'item-2-5', name: 'Ranveer Singh — Dhurandhar' },
      { id: 'item-2-6', name: 'Rana Daggubati — Baahubali' },
      { id: 'item-2-7', name: 'Sivakarthikeyan — Amaran' },
      { id: 'item-2-8', name: 'Silambarasan — Pathu Thala' },
      { id: 'item-2-9', name: 'R. Madhavan — Irudhi Suttru' },
      { id: 'item-2-10', name: 'Aamir Khan — Dangal' }
    ]
  }
];

export const loadGames = async () => {
  try {
    const gamesRef = ref(database, 'saved_games');
    const snapshot = await get(gamesRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return DEFAULT_GAMES;
  } catch (e) {
    console.error('Failed to load games:', e);
    return DEFAULT_GAMES;
  }
};

export const saveGames = async (games) => {
  try {
    const gamesRef = ref(database, 'saved_games');
    await set(gamesRef, games);
    return true;
  } catch (e) {
    console.error('Failed to save games:', e);
    return false;
  }
};
