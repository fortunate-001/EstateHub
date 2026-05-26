import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAJ_OVTMzeU83OIsJQMtjlU-frXewxenqk",
  authDomain: "real-estate-22d34.firebaseapp.com",
  projectId: "real-estate-22d34",
  storageBucket: "real-estate-22d34.firebasestorage.app",
  messagingSenderId: "316217101451",
  appId: "1:316217101451:web:b5123fd53a0accfafd588e",
  measurementId: "G-QCNQ9V32L6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;