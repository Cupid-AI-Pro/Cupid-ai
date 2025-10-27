from fastapi import FastAPI, Request
from sentence_transformers import SentenceTransformer
import faiss, pickle, numpy as np
from groq import Groq
import os

app = FastAPI()

# ✅ Groq client (fast + cloud)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Load Cupid embeddings
model = SentenceTransformer("all-MiniLM-L6-v2")
index = faiss.read_index("cupid.index")
with open("chunks.pkl", "rb") as f:
    chunks = pickle.load(f)

def retrieve_docs(query, k=2):
    q_emb = model.encode([query])
    D, I = index.search(np.array(q_emb).astype('float32'), k)
    return [chunks[i] for i in I[0] if i < len(chunks)]

@app.post("/chat")
async def chat(req: Request):
    data = await req.json()
    query = data.get("question", "")
    docs = retrieve_docs(query)
    context = "\n\n".join(docs)

    prompt = f"""You are Cupid AI, the friendly assistant for the Cupid dating platform.
Use the context to answer clearly and quickly.

Context:
{context}

Question: {query}

Answer:"""

    chat_completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are Cupid AI, a helpful dating assistant."},
            {"role": "user", "content": prompt},
        ]
    )

    answer = chat_completion.choices[0].message.content
    return {"answer": answer, "context_used": docs}




