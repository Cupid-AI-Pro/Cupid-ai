import express from "express";
import Chat from "../models/Chat.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const chats = await Chat.find({ userId: req.params.userId }).sort({ createdAt: 1 });
  res.json(chats);
});

export default router;
