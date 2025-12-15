// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDvTm5GGiNAfLyODjFtqgUWK0ZESKEqXdA",
  authDomain: "taufoods-bedf5.firebaseapp.com",
  projectId: "taufoods-bedf5",
  storageBucket: "taufoods-bedf5.firebasestorage.app",
  messagingSenderId: "680976069133",
  appId: "1:680976069133:web:7a319b3ee2a6dabb0d1b44",
  measurementId: "G-MET8X9C8MJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


