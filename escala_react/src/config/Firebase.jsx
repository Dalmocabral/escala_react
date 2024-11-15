// config/Firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC5Tl4jTpHNXQ3j8oGrKjgyrK0WvXGwAzw",
  authDomain: "escala-de-dispensa.firebaseapp.com",
  projectId: "escala-de-dispensa",
  storageBucket: "escala-de-dispensa.firebasestorage.app",
  messagingSenderId: "398390112543",
  appId: "1:398390112543:web:741fb49972aca44027402a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, push, onValue, remove, update };
