// config/Firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDGHmiLBssNpN3sBZ45lIGHkQz9jDVmtr8",
  authDomain: "escalareact-dcbe0.firebaseapp.com",
  databaseURL: "https://escalareact-dcbe0-default-rtdb.firebaseio.com",
  projectId: "escalareact-dcbe0",
  storageBucket: "escalareact-dcbe0.firebasestorage.app",
  messagingSenderId: "840368586880",
  appId: "1:840368586880:web:034a0b2bdf2c5eecfbe665"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, push, onValue, remove, update };
