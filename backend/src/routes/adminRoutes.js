import express from "express";
import Knowledge from "../models/Knowledge.js";
import Settings from "../models/Settings.js";

const router = express.Router();

/* ============================
   KNOWLEDGE BASE
============================ */

/* Add or update QnA */
router.post("/knowledge", async (req, res) => {
  try {
    const { keywords, answer, priority } = req.body;

    if (!keywords || !answer) {
      return res.status(400).json({ error: "keywords and answer required" });
    }

    const item = await Knowledge.create({
      keywords,
      answer,
      priority: priority || 1
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* List all */
router.get("/knowledge", async (req, res) => {
  const list = await Knowledge.find().sort({ priority: -1 });
  res.json(list);
});

/* Delete */
router.delete("/knowledge/:id", async (req, res) => {
  await Knowledge.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

/* ============================
   UI SETTINGS
============================ */

router.post("/settings", async (req, res) => {
  const { type, values } = req.body;

  await Settings.findOneAndUpdate(
    { type },
    { values },
    { upsert: true, new: true }
  );

  res.json({ success: true });
});

router.get("/settings/:type", async (req, res) => {
  const s = await Settings.findOne({ type: req.params.type });
  res.json(s || { values: [] });
});

export default router;


