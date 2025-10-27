# ingest_cupid.py
from sentence_transformers import SentenceTransformer
import faiss, pickle, numpy as np

# 1. Load data
with open("Cu Ai.txt", "r", encoding="utf-8") as f:
    text = f.read()

# 2. Split into chunks
def chunk_text(t, chunk_size=200, overlap=50):
    words = t.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i+chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap
    return chunks

chunks = chunk_text(text)

# 3. Create embeddings
model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model.encode(chunks, show_progress_bar=True)

# 4. Store to FAISS
index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(np.array(embeddings).astype('float32'))
faiss.write_index(index, "cupid.index")

# Save chunks
with open("chunks.pkl", "wb") as f:
    pickle.dump(chunks, f)

print("✅ Cupid data ingested — files saved: cupid.index & chunks.pkl")
