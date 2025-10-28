from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os
from groq import Groq
from datetime import datetime, timedelta
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- AUTO ROUND SYSTEM ----------
START_ROUND_DATE = datetime(2025, 11, 1)
ROUND_GAP_DAYS = 9  # new round every 10 days approx
EMAIL = "cupid.livepro@gmail.com"

def get_next_round():
    """Auto-calculate the next upcoming round."""
    today = datetime.now()
    days_since_start = (today - START_ROUND_DATE).days
    next_round = max(1, (days_since_start // ROUND_GAP_DAYS) + 2)
    next_date = START_ROUND_DATE + timedelta(days=(next_round - 1) * ROUND_GAP_DAYS)
    return next_round, next_date.strftime("%d %B, %Y")

def check_special_queries(question: str):
    """Detect if user is asking about rounds, links, or support."""
    q = question.lower()
    if any(word in q for word in ["next round", "round", "when", "kab", "date", "matchmaking"]):
        r, d = get_next_round()
        return f"The next Cupid matchmaking round will be Round {r} on {d}. 💘"
    if any(word in q for word in ["link", "form", "register", "apply"]):
        r, d = get_next_round()
        return (
            f"The registration link isn't live right now. The next round is Round {r} on {d}. "
            f"You’ll find the link on Cupid’s Instagram story when it goes live!"
        )
    if any(word in q for word in ["talk", "contact", "executive", "email", "help", "support"]):
        return f"You can contact our team anytime at {EMAIL} for personal assistance. 💌"
    return None

# ---------- LANGUAGE DETECTOR ----------
def detect_hindi(text):
    """Detect if message contains Hindi words or script."""
    devanagari = re.search(r'[\u0900-\u097F]', text)
    common_hindi_words = any(
        word in text.lower()
        for word in ["kaise", "kya", "hai", "nahi", "bata", "kab", "karna", "hoga", "ha", "karo", "mera"]
    )
    return bool(devanagari or common_hindi_words)


@app.post("/chat")
async def chat(request: Request):
    try:
        data = await request.json()
        question = data.get("question", "").strip()

        if not question:
            return {"answer": "Ask me anything about Cupid 💘 — plans, process, or how to join!"}

        # first handle instant answers
        special_reply = check_special_queries(question)
        if special_reply:
            return {"answer": special_reply}

        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return {"answer": "Server error: missing API key configuration."}

        client = Groq(api_key=api_key)

        # detect language tone
        user_is_hindi = detect_hindi(question)
        tone_instruction = (
            "User is using Hindi or Hinglish — reply naturally in Hinglish, casual and expressive college tone. "
            "Use light humor or emojis sometimes. Be friendly, not robotic."
            if user_is_hindi
            else "User is using English — reply in friendly and slightly formal English. Be clear, warm, and humanlike."
        )

        res = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": (
                        f"You are *Cupid AI* — the official friendly assistant of the Cupid matchmaking platform on Instagram.\n\n"
                        f"{tone_instruction}\n\n"
                        "Your vibe: warm, slightly flirty but respectful, casual college-student tone. "
                        "You mix English + Hinglish naturally and answer like a real person.\n\n"

                        "🎯 **About Cupid:**\n"
                        "Cupid helps college students find relationships, friendships, and meaningful connections from nearby campuses. "
                        "Every ~10 days, a new matchmaking round starts — the Google Form link is shared on Cupid’s Instagram story for 24 hours. "
                        "After submission, matches are released via email within 1–2 days.\n\n"

                        "📝 **Form Process:**\n"
                        "The form is short-answer based. It includes:\n"
                        "1️⃣ Your basic details (college, year, age, gender, etc.)\n"
                        "2️⃣ Match preferences (type, campus proximity, interests)\n"
                        "3️⃣ Non-negotiables (things you strictly want or avoid)\n"
                        "4️⃣ Payment section — *but it's completely FREE for females.* 💃\n\n"

                        "💌 **Match Delivery:**\n"
                        "When a match is found, *both* people receive each other’s details at the same time. "
                        "So both know about the match together — it’s never one-sided or secret.\n\n"

                        "💰 **Plans:**\n"
                        "• ₹99 (Standard) – we’ll *try to find you the most suitable match available in that round.* "
                        "It’s not a guaranteed match plan because it depends on whether a compatible person with your preferences applied in that round. "
                        "But don’t worry — Cupid’s system keeps you in the loop for next rounds automatically 💘\n\n"
                        "• ₹249 (Premium) – If you want full money safety, this is best. "
                        "You get priority matchmaking + preference-based filtering. "
                        "And if no match is found or the chat never starts, you get a *full refund.* 💸\n\n"
                        "• ₹49 (Crush Check) – check if your crush is active (anonymous lookup).\n\n"

                        "💬 **If someone asks — 'fayda kya agar guarantee nahi hai?'**\n"
                        "Explain that matches depend on available preferences — humesha ekdam perfect match milna possible nahi hota, "
                        "kyunki kabhi kabhi aapka compatible person agle round me aata hai. "
                        "Keep trying, kyunki kai baar Cupid users ko *3–5 rounds baad unka perfect match mila hai!* ❤️ "
                        "So har round me apply karte raho — it’s worth the wait.\n\n"

                        "💬 **If someone says it's costly:**\n"
                        "Politely explain that pricing helps maintain real, balanced matches — "
                        "free entries invite fake profiles. Cupid keeps it exclusive and private.\n\n"

                        "👩‍🎓 **Girls & Discounts:**\n"
                        "Females often get free or priority entries, so trying once is totally worth it!\n\n"

                        "🎓 **If a non-college user asks:**\n"
                        "Say yes — anyone 18–25 has the best chance for a match. "
                        "Older users can apply too; chances are slightly lower but still possible.\n\n"

                        "❓ **If unsure or out of scope:**\n"
                        "Say: 'I'm not 100% sure about that 😅 — you can DM your college’s Cupid Instagram admin to confirm.'\n\n"

                        "🧠 **Tone:** friendly, natural, and context-aware — "
                        "keep replies detailed where needed, short otherwise."
                    ),
                },
                {"role": "user", "content": question},
            ],
        )

        return {"answer": res.choices[0].message.content}

    except Exception as e:
        print("Error in /chat:", e)
        return {"answer": f"Server error: {str(e)}"}


