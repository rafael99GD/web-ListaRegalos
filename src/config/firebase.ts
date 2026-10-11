import { initializeApp, getApps, getApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

// Default configuration placeholder or environment variables
// Rafael can fill this directly or use a .env file!
export const firebaseConfig = {
  apiKey: "AIzaSyBl5P1fXtPEx22qJEEBuNy7xYCEVJr3at8",
  authDomain: "listaderegalos-8e351.firebaseapp.com",
  projectId: "listaderegalos-8e351",
  storageBucket: "listaderegalos-8e351.firebasestorage.app",
  messagingSenderId: "487618435291",
  appId: "1:487618435291:web:15480106b4569a148b14fe"
};

// Check if credentials have been filled in
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey.length > 5 &&
  !firebaseConfig.apiKey.includes('TU_API_KEY')
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("🌲 [Firebase] Conexión establecida con éxito:", firebaseConfig.projectId);
  } catch (error) {
    console.warn("⚠️ [Firebase] Error inicializando Firebase SDK, usando modo local:", error);
  }
} else {
  console.info("ℹ️ [Firebase] No se detectaron credenciales en .env o firebase.ts. Modo almacenamiento local/demo activo.");
}

export { app, auth, db };
