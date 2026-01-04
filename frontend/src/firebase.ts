import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAEk_8npg5X6nTfedXNPXmh-CsMhEEZPVQ",
  authDomain: "cupid-ai-daa17.firebaseapp.com",
  projectId: "cupid-ai-daa17",
  storageBucket: "cupid-ai-daa17.firebasestorage.app",
  messagingSenderId: "713988693806",
  appId: "1:713988693806:web:e53097e1c1bfae7ae7e4bf",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
