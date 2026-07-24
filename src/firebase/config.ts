import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAdGW_FM9n7UTNxjaWQJhFvva6r1gUH0iQ",
  authDomain: "ergotech-k3.firebaseapp.com",
  projectId: "ergotech-k3",
  storageBucket: "ergotech-k3.firebasestorage.app",
  messagingSenderId: "783205380951",
  appId: "1:783205380951:web:76216ed220dc8c5ab70412",
  measurementId: "G-4BL1B4S7XJ"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
