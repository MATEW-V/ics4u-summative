import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Paste your firebaseConfig from Firebase Console here
const firebaseConfig = {
    apiKey: "AIzaSyDIuAc-wb23WvficnBZu9XdmNctRNXVTpI",
    authDomain: "summative-4f1f6.firebaseapp.com",
    projectId: "summative-4f1f6",
    storageBucket: "summative-4f1f6.firebasestorage.app",
    messagingSenderId: "1019687747873",
    appId: "1:1019687747873:web:d1b253d452d2901762be60"
  };

const config = initializeApp(firebaseConfig)
const auth = getAuth(config);
const firestore = getFirestore(config);

export { auth, firestore };