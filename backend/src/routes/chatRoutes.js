import express from "express";
import Chat from "../models/Chat.js";
import Knowledge from "../models/Knowledge.js";

const router = express.Router();

/* =====================================================
   UTILITIES
===================================================== */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clean = (text) =>
  text.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();

/* =====================================================
   ROUND ENGINE (INFINITE)
===================================================== */

/*
Delhi:
Round 6 → Jan 1
Round 7 → Jan 11
Round 8 → Jan 21
Round 9 → Feb 1
Pattern: 1, 11, 21 every month

Rajasthan:
Round 9 → Jan 6
Round 10 → Jan 16
Round 11 → Jan 26
Pattern: 6, 16, 26
*/

const delhiStart = new Date("2026-01-01");
const rajasthanStart = new Date("2026-01-06");

function getNextRound(region) {
  const now = new Date();
  let date = new Date(region === "delhi" ? delhiStart : rajasthanStart);
  let round = region === "delhi" ? 6 : 9;
  const pattern = region === "delhi" ? [1, 11, 21] : [6, 16, 26];

  while (date < now) {
    const dayIndex = (round - 1) % 3;
    date.setDate(pattern[dayIndex]);

    if (date < now) {
      date.setMonth(date.getMonth() + 1);
      round++;
    }
  }

  return {
    round,
    date: date.toDateString(),
  };
}

/* =====================================================
   DATABASE KNOWLEDGE (ADMIN OVERRIDE)
===================================================== */

async function getDynamicReply(text) {
  const msg = clean(text);
  const knowledge = await Knowledge.find().sort({ priority: -1 });

  for (let item of knowledge) {
    for (let key of item.keywords) {
      if (msg.includes(key.toLowerCase())) {
        return item.answer;
      }
    }
  }
  return null;
}

/* =====================================================
   CUPID CORE BRAIN (FALLBACK)
===================================================== */

function getCupidReply(text) {
  const msg = clean(text);

  // Greetings
  if (msg.match(/\b(hi|hello|hey|namaste|hola|bonjour|yo|hii)\b/)) {
    return pick([
      "Heyyy 💕 Ready to meet someone special?",
      "Hello 😍 Cupid is happy to see you!",
      "Hi there ❤️ Your love journey starts here.",
      "Hey! Let’s find your perfect match 💖",
    ]);
  }

  // What is Cupid
  if (msg.match(/\b(cupid|what is|whats this|what do you do|kya hai)\b/)) {
    return "Cupid is an Instagram dating platform made for college students to find relationships, friendships, and real connections from nearby campuses 💕";
  }

  // Process
  if (msg.match(/\b(process|procedure|register|apply|join|participate|kaise)\b/)) {
    return "Cupid runs a matchmaking round every 10 days. We release a form on our Instagram stories where you fill your details, preferences, and non-negotiables. We then send your best match to your email within 2 days 💌";
  }

  // Plans
  if (msg.match(/\b(price|plan|cost|paise|free|payment)\b/)) {
    return `We offer 3 plans 💳

• ₹99 Basic – Match based on preferences & availability (non-refundable)  
• ₹249 Select – See Instagram profiles first, pay only if you like (refundable)  
• ₹599 Luxury – Premium concierge matchmaking (coming soon)  

Girls can participate for free 💕`;
  }

  // Who can apply
  if (msg.match(/\b(age|college|outsider|who can|apply)\b/)) {
    return "Anyone aged 18 to 26 from any college can apply. Instagram is used only for safety and verification 💖";
  }

  // Colleges
  if (msg.match(/\b(college|campus)\b/)) {
    return `We currently operate in:

Delhi NCR  
• IIT Delhi  
• DTU  
• NSUT  
• Sharda  
• Bennett  
• ABES  
• Lloyd  
• NIET  

Rajasthan  
• Poornima University  
• JECRC  
• LNMIIT  
• BITS Pilani  
• IIT Jodhpur  
• Amity Jaipur  
• Banasthali Vidyapeeth 💕`;
  }

  // Discount
  if (msg.match(/\b(discount|offer|old user|returning)\b/)) {
    return "Whenever offers are available, we announce them on our Instagram stories. For special requests, email cupid.livepro@gmail.com 💌";
  }

  // Support
  if (msg.match(/\b(contact|support|help|talk|executive)\b/)) {
    return "You can contact our support team anytime at cupid.livepro@gmail.com 📩";
  }

  // Ghosted
  if (msg.match(/\b(ghost|ignored|no reply|not replying)\b/)) {
    return "Sometimes users check their match email 1–2 days late. If your match fully ignores you, contact our Instagram admins. If it still fails, you will get a free next round 💖";
  }

  // Fake / complaint
  if (msg.match(/\b(fake|creep|scam|complaint)\b/)) {
    return "To report a fake profile or bad behavior, email cupid.livepro@gmail.com with details 🚨";
  }

  // Refund
  if (msg.match(/\b(refund|money back|cancel)\b/)) {
    return "Refunds are possible only if your conversation has not started. Once chatting begins, it depends on how the conversation is handled 💬";
  }

  // Rounds
  if (msg.match(/\b(round|next|date)\b/)) {
    return "Are you from Delhi or Rajasthan?";
  }

  if (msg.includes("delhi")) {
    const r = getNextRound("delhi");
    return `Your next Delhi round is Round ${r.round} on ${r.date} 💕`;
  }

  if (msg.includes("rajasthan")) {
    const r = getNextRound("rajasthan");
    return `Your next Rajasthan round is Round ${r.round} on ${r.date} 💕`;
  }

  // Form link
  if (msg.match(/\b(form|link)\b/)) {
    return "The form link is released on our Instagram stories on the day of the round 📲";
  }

  // Fallback
  return "I’m still learning 😅 You can ask our Instagram admins or email cupid.livepro@gmail.com 💕";
}

/* =====================================================
   API ROUTES
===================================================== */

// Create new chat
router.post("/new", async (req, res) => {
  try {
    const { userId } = req.body;
    const chat = await Chat.create({ userId, messages: [] });
    res.json(chat);
  } catch {
    res.status(500).json({ error: "Failed to create chat" });
  }
});

// Send message
router.post("/send", async (req, res) => {
  try {
    const { userId, chatId, message } = req.body;

    let chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) chat = await Chat.create({ userId, messages: [] });

    chat.messages.push({ sender: "user", text: message });

    // 1️⃣ Try DB knowledge
    let reply = await getDynamicReply(message);

    // 2️⃣ Fallback to Cupid brain
    if (!reply) {
      reply = getCupidReply(message);
    }

    chat.messages.push({ sender: "ai", text: reply });

    await chat.save();
    res.json({ reply, messages: chat.messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
});

// Sidebar chat list
router.get("/list/:userId", async (req, res) => {
  const chats = await Chat.find({ userId: req.params.userId }).sort({
    createdAt: -1,
  });
  res.json(chats);
});

// Load one chat
router.get("/:chatId", async (req, res) => {
  const chat = await Chat.findById(req.params.chatId);
  res.json(chat);
});

export default router;
