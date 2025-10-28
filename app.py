from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os
from groq import Groq

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chat endpoint
@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    question = data.get("question", "")

    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    res = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are Cupid AI — a friendly and witty campus relationship assistant "
                    "that helps students with dating, friendship, and campus life advice."
                ),
            },
            {"role": "user", "content": question},
        ],
    )

    return {"answer": res.choices[0].message.content}





