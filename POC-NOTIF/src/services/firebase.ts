import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD65ch1YJWV69PxhNu_y6v054w8wPdCdkU",
  authDomain: "poc-notificacoes-mobile.firebaseapp.com",
  projectId: "poc-notificacoes-mobile",
  storageBucket: "poc-notificacoes-mobile.firebasestorage.app",
  messagingSenderId: "832995463451",
  appId: "1:832995463451:web:ac54bed4147ffb4943c3be",
  measurementId: "G-7ZEMXZP4ZR"
};

// Evita re-inicialização do app durante hot-reloads no Expo
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);