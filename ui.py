import streamlit as st
import requests
import time

st.set_page_config(page_title="Cupid AI Chat 💘", page_icon="💘", layout="centered")

# ---------- CUSTOM CSS ----------
st.markdown("""
<style>
body {
    background: linear-gradient(135deg,#fbe5e5,#ffdee9,#f4e2d8);
    font-family: 'Poppins', sans-serif;
}
#MainMenu, footer, header {visibility:hidden;}

.chat-container {
    background:rgba(255,255,255,0.75);
    backdrop-filter: blur(10px);
    border-radius:25px;
    box-shadow:0 0 25px rgba(0,0,0,0.15);
    padding:25px;
    width:80%;
    margin:auto;
    animation: fadeIn 0.8s ease-in;
}

@keyframes fadeIn {
  from {opacity:0; transform: translateY(20px);}
  to {opacity:1; transform: translateY(0);}
}

.user-msg {
    background:linear-gradient(120deg,#ff9a9e,#fecfef);
    color:#000;
    border-radius:18px 18px 0 18px;
    padding:12px 18px;
    margin:8px 0;
    align-self:flex-end;
    max-width:75%;
}

.bot-msg {
    background:linear-gradient(120deg,#c9ffbf,#ffafbd);
    color:#000;
    border-radius:18px 18px 18px 0;
    padding:12px 18px;
    margin:8px 0;
    align-self:flex-start;
    max-width:75%;
}

.typing-dots {
    color: #888;
    font-size: 16px;
    letter-spacing: 2px;
    margin-top: 5px;
    animation: blink 1s infinite;
}
@keyframes blink {
    50% { opacity: 0.3; }
}

.chatbox { display:flex; flex-direction:column; }

.stTextInput>div>div>input {
    border-radius:12px;
    border:1px solid #ff7eb3;
    background-color:#fff5f7;
    color:#000;
}
.stButton>button {
    background:linear-gradient(90deg,#ff758c,#ff7eb3);
    color:white;
    border:none;
    border-radius:12px;
    padding:0.6em 1.5em;
    font-weight:bold;
    transition:0.3s;
}
.stButton>button:hover {transform:scale(1.05);}
</style>
""", unsafe_allow_html=True)
# --------------------------------

st.markdown("<h2 style='text-align:center;'>💘 Cupid AI — Your Campus Match Assistant</h2>", unsafe_allow_html=True)

API_URL = "https://cupid-ai-backend.onrender.com/chat"


# --------------- Chat ---------------
if "messages" not in st.session_state:
    st.session_state.messages = []

# show chat
with st.container():
    st.markdown("<div class='chat-container'><div class='chatbox'>", unsafe_allow_html=True)
    for msg in st.session_state.messages:
        role_class = "user-msg" if msg["role"] == "user" else "bot-msg"
        st.markdown(f"<div class='{role_class}'>{msg['content']}</div>", unsafe_allow_html=True)
    st.markdown("</div></div>", unsafe_allow_html=True)

st.markdown("---")

# input box
user_input = st.text_input("💬 Ask Cupid AI anything about love & matches…", key="user_input")

if st.button("Send 💌"):
    if user_input.strip():
        # show user message instantly
        st.session_state.messages.append({"role": "user", "content": user_input})
        st.empty()  # placeholder refresh

        with st.spinner("Cupid is typing 💭..."):
            try:
                res = requests.post(API_URL, json={"question": user_input}, timeout=300)
                if res.status_code == 200:
                    ans = res.json().get("answer", "No response from Cupid.")
                else:
                    ans = f"⚠️ Backend error: {res.status_code}"
            except Exception as e:
                ans = f"⚠️ Error: {e}"

        # add bot reply
        st.session_state.messages.append({"role": "assistant", "content": ans})
        time.sleep(0.3)
        st.rerun()

