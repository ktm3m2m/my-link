import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

// Firebase configuration (provided by user)
const firebaseConfig = {
  apiKey: "AIzaSyCEWHDt80bMQyVJQw4XvW4uGruQ9Fs6xRU",
  authDomain: "my-link-51b6b.firebaseapp.com",
  projectId: "my-link-51b6b",
  storageBucket: "my-link-51b6b.firebasestorage.app",
  messagingSenderId: "146552752501",
  appId: "1:146552752501:web:f68dc9c487253c886c2b3c",
  measurementId: "G-73HCMGGJPB",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
let analytics: Analytics | undefined;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, auth, analytics };
