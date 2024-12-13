import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDbGsoPJVkos2dkarj7iZoYlzgrrdgBxzQ",
  authDomain: "inovvio.firebaseapp.com",
  projectId: "inovvio",
  storageBucket: "inovvio.firebasestorage.app",
  messagingSenderId: "479836471180",
  appId: "1:479836471180:web:75e83188c88cfd882e20a9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);