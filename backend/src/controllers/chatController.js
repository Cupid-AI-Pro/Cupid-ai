import Chat from "../models/Chat.js";

const CONFIG = {
  delhi: {
    baseDate: new Date("2026-01-01"),
    baseRound: 6,
    days: [1, 11, 21]
  },
  rajasthan: {
    baseDate: new Date("2026-01-06"),
    baseRound: 9,
    days: [6, 16, 26]
  }
};

function getNextRound(city) {
  const cfg = CONFIG[city];
  const today = new Date();

  let round = cfg.baseRound;
  let date = new Date(cfg.baseDate);

  while (date < today) {
    const currentDay = date.getDate();
    const idx = cfg.days.indexOf(currentDay);
    const nextIdx = (idx + 1) % cfg.days.length;

    if (nextIdx === 0) date.setMonth(date.getMonth() + 1);
    date.setDate(cfg.days[nextIdx]);
    round++;
  }

  return {
    round,
    date: date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  };
}

export const chatReply = async (req, res) => {
  const { userId, message, city } = req.body;
  const text = message.toLowerCase();
  let reply = "Sorry, I didn't understand that.";

  if (text.includes("plan") || text.includes("price") || text.includes("fees")) {
    reply = "We offer 99 Basic (1 match, no refund) and 249 Premium (preview matches on Instagram, refund before finalizing). Girls join free.";
  }

  if (text.includes("refund")) {
    reply = "Refund is possible only before final match is sent. Once Instagram ID is shared, refund becomes difficult.";
  }

  if (text.includes("cupid")) {
    reply = "Cupid is an Instagram-based dating platform that connects students from nearby campuses through matchmaking rounds every 10 days.";
  }

  if (text.includes("form") || text.includes("register") || text.includes("join")) {
    reply = "You can join by filling the form released on our Instagram story on round day.";
  }

  if (text.includes("round") || text.includes("date") || text.includes("next")) {
    const info = getNextRound(city);
    reply = `Your next ${city} round is Round ${info.round} on ${info.date}.`;
  }

  await Chat.create({ userId, message, reply });
  res.json({ reply });
};
