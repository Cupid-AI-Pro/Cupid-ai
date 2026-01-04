import express from "express";
import User from "../models/User.js";

const router = express.Router();

/* ================================
   NORMAL EMAIL + PASSWORD REGISTER
================================ */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, city } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      city,
      plan: "free"
    });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});


/* ================================
   NORMAL EMAIL + PASSWORD LOGIN
================================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});


/* ================================
   GOOGLE LOGIN / SIGNUP
================================ */
router.post("/google", async (req, res) => {
  try {
    const { name, email, picture } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "google",
        plan: "free"
      });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Google login failed" });
  }
});

export default router;

