import mongoose from "mongoose";

const knowledgeSchema = new mongoose.Schema({
  keywords: [String],        // ["plan", "price", "cost", "fee"]
  answer: String,           // The reply
  priority: { type: Number, default: 1 }, // Higher = checked first
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Knowledge", knowledgeSchema);
