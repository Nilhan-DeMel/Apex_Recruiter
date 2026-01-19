import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Firebase configuration
// These are public keys - safe to commit
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "REDACTED_PUBLIC_FIREBASE_WEB_KEY",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "apex-recruiter-p1.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "apex-recruiter-p1",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "apex-recruiter-p1.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "307617273557",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:307617273557:web:651fea61733414cb5fb45c"
};

// Initialize Firebase (singleton pattern)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

function initializeFirebase() {
    if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApps()[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    return { app, auth, db, storage };
}

// Export initialized instances
export function getFirebaseApp(): FirebaseApp {
    if (!app) initializeFirebase();
    return app;
}

export function getFirebaseAuth(): Auth {
    if (!auth) initializeFirebase();
    return auth;
}

export function getFirebaseDb(): Firestore {
    if (!db) initializeFirebase();
    return db;
}

export function getFirebaseStorage(): FirebaseStorage {
    if (!storage) initializeFirebase();
    return storage;
}

// Initialize on module load
if (typeof window !== "undefined") {
    initializeFirebase();
}

export { app, auth, db, storage };
