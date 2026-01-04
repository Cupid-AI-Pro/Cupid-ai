import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  type: {
    type: String, // "welcome", "chips"
    required: true
  },
  values: [String]   // messages or button texts
});

export default mongoose.model("Settings", settingsSchema);
