
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBEH-phVQQJnKzyuj3Te3DZjTTiSGcC3g",
  authDomain: "ai-interviewer-70429.firebaseapp.com",
  projectId: "ai-interviewer-70429",
  storageBucket: "ai-interviewer-70429.firebasestorage.app",
  messagingSenderId: "112006141236",
  appId: "1:112006141236:web:df8260a39937661e7c8161",
  measurementId: "G-VJLEX1WVZS"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) :getApp();
export const auth = getAuth(app);
export const db = getFirestore(app)