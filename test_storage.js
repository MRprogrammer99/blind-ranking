const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadString } = require('firebase/storage');

const firebaseConfig = {
  apiKey: "AIzaSyAq5J0Fa0kzQ-r_lFMQ4R42NjKawrEJU9k",
  authDomain: "blind-ranking-5c5fa.firebaseapp.com",
  projectId: "blind-ranking-5c5fa",
  storageBucket: "blind-ranking-5c5fa.appspot.com",
  messagingSenderId: "791938096916",
  appId: "1:791938096916:web:82ae762ca627883af36c01"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const storageRef = ref(storage, 'test_image.txt');

uploadString(storageRef, 'hello').then(() => {
  console.log('UPLOAD SUCCESS');
}).catch(err => {
  console.log('UPLOAD FAILED', err.code, err.message, err.customData, err.serverResponse);
});
