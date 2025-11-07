from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os
from groq import Groq
from datetime import datetime, timedelta
import re
import time  # 👈 added for sleep delay
import asyncio  # 👈 for async sleep

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Cupid AI backend is live! Use POST /chat to talk 💘"}

@app.head("/")
async def head_root():
    return {"status": "ok"}

@app.get("/ping")
async def ping():
    return {"status": "alive", "message": "Cupid AI backend is awake 💘"}

START_ROUND_DATE = datetime(2025, 11, 1)
ROUND_GAP_DAYS = 9
EMAIL = "cupid.livepro@gmail.com"

def get_next_round():
    today = datetime.now()
    days_since_start = (today - START_ROUND_DATE).days
    next_round = max(1, (days_since_start // ROUND_GAP_DAYS) + 2)
    next_date = START_ROUND_DATE + timedelta(days=(next_round - 1) * ROUND_GAP_DAYS)
    return next_round, next_date.strftime("%d %B, %Y")

def check_special_queries(question: str):
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

def detect_hindi(text):
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

        special_reply = check_special_queries(question)
        if special_reply:
            return {"answer": special_reply}

        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return {"answer": "Server error: missing API key configuration."}

        client = Groq(api_key=api_key)
        user_is_hindi = detect_hindi(question)
        tone_instruction = (
            "User is using Hindi or Hinglish — reply naturally in Hinglish, casual and expressive college tone. "
            "Use light humor or emojis sometimes. Be friendly, not robotic."
            if user_is_hindi
            else "User is using English — reply in friendly and slightly formal English. Be clear, warm, and humanlike."
        )

        # ---------- RETRY LOGIC FOR 429 ERROR ----------
        max_retries = 3
        delay_seconds = 5
        for attempt in range(max_retries):
            try:
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
                                "📝 **Form Process:** ... (rest of your text unchanged) ..."
                            ),
                        },
                        {"role": "user", "content": question},
                    ],
                )
                return {"answer": res.choices[0].message.content}

            except Exception as e:
                if "429" in str(e):
                    if attempt < max_retries - 1:
                        print(f"⚠️ 429 Too Many Requests — retrying in {delay_seconds}s (Attempt {attempt+1})")
                        # Inform the user instantly
                        if attempt == 0:
                            return {"answer": "Cupid AI is a bit overloaded right now 💘. Please wait a few seconds while I fetch your reply..."}
                        await asyncio.sleep(delay_seconds)
                        continue
                    else:
                        return {"answer": "Too many users are chatting right now 💖. Please try again in a minute!"}
                else:
                    raise e

    except Exception as e:
        print("Error in /chat:", e)
        return {"answer": "Cupid AI is taking a short break 💞 — please try again in a few seconds."}





