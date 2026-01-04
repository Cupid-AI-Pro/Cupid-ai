import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },

  // For Google login
  googleId: { type: String, unique: true, sparse: true },
  picture: String,

  // For email/password login
  password: String,

  plan: { type: String, default: "free" },
  city: String,

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
