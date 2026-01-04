import express from "express";
import Knowledge from "../models/Knowledge.js";

const router = express.Router();

/* Add new knowledge */
router.post("/add", async (req, res) => {
  try {
    const { keywords, answer, priority } = req.body;

    const data = await Knowledge.create({
      keywords,
      answer,
      priority: priority || 1
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to add knowledge" });
  }
});

/* Get all knowledge */
router.get("/all", async (req, res) => {
  const data = await Knowledge.find().sort({ priority: -1 });
  res.json(data);
});

/* Delete */
router.delete("/:id", async (req, res) => {
  await Knowledge.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
