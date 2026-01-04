import { motion } from "motion/react";
import { Menu, Heart, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

interface HeaderProps {
  onMenuClick: () => void;
}

/* 🔥 Firebase config */
const firebaseConfig = {
  apiKey: "AIzaSyAEk_8npg5X6nTfedXNPXmh-CsMhEEZPVQ",
  authDomain: "cupid-ai-daa17.firebaseapp.com",
  projectId: "cupid-ai-daa17",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export function Header({ onMenuClick }: HeaderProps) {
  const [user, setUser] = useState<any>(null);

  /* Load saved user */
  useEffect(() => {
    const saved = localStorage.getItem("cupidUser");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  /* 🔐 Google Login */
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const u = result.user;

      const profile = {
        name: u.displayName,
        email: u.email,
        photo: u.photoURL,
        uid: u.uid,
      };

      setUser(profile);
      localStorage.setItem("cupidUser", JSON.stringify(profile));
    } catch (err) {
      console.error(err);
      alert("Login cancelled");
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 20 }}
      className="relative z-20 backdrop-blur-2xl"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))",
        boxShadow: "0 4px 24px rgba(236,72,153,.15)",
        borderBottom: "1px solid rgba(255,255,255,.5)",
      }}
    >
      <div className="relative px-6 py-4 flex justify-between items-center">
        {/* Left */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onMenuClick}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="rounded-xl p-2"
          >
            <Menu size={24} className="text-pink-600" />
          </motion.button>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-white shadow">
              <Heart className="text-pink-500 fill-pink-500" size={24} />
            </div>
            <h1 className="bg-gradient-to-r from-pink-600 via-purple-500 to-rose-600 bg-clip-text text-transparent">
              Cupid AI
            </h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs">AI Online</span>
          </div>

          <motion.button
            onClick={handleLogin}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white"
            style={{
              background: "linear-gradient(135deg,#ec4899,#f43f5e)",
              boxShadow: "0 8px 24px rgba(236,72,153,.4)",
            }}
          >
            <LogIn size={18} />
            <span>{user ? user.name : "Sign In"}</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
