# ui.py
import streamlit as st
import requests
import time
from typing import List, Dict

st.set_page_config(page_title="Cupid AI Chat 💘", page_icon="💘", layout="centered")

# ---------- CUSTOM CSS ----------
st.markdown(
    """
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
    word-wrap:break-word;
}

.bot-msg {
    background:linear-gradient(120deg,#c9ffbf,#ffafbd);
    color:#000;
    border-radius:18px 18px 18px 0;
    padding:12px 18px;
    margin:8px 0;
    align-self:flex-start;
    max-width:75%;
    word-wrap:break-word;
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
.clear-btn {
    background:transparent;
    color:#ff4d88;
    border:1px dashed #ffb3cf;
    border-radius:10px;
    padding:6px 10px;
}
</style>
""",
    unsafe_allow_html=True,
)
# --------------------------------

st.markdown("<h2 style='text-align:center;'>💘 Cupid AI — Your Campus Match Assistant</h2>", unsafe_allow_html=True)

# Change API_URL if your backend is hosted elsewhere
API_URL = "https://cupid-ai-backend-cdmj.onrender.com/chat"

# ---------------- Session state init ----------------
if "messages" not in st.session_state:
    # messages is a list of dicts: {"role": "user"/"assistant", "content": str}
    st.session_state.messages: List[Dict[str, str]] = []

if "last_user_input" not in st.session_state:
    st.session_state.last_user_input = ""

# --------------- Chat UI ---------------
def render_chat():
    st.markdown("<div class='chat-container'><div class='chatbox'>", unsafe_allow_html=True)
    # show messages (oldest first)
    for msg in st.session_state.messages:
        role_class = "user-msg" if msg.get("role") == "user" else "bot-msg"
        content = msg.get("content", "")
        # escape simple html chars to avoid accidental HTML injection
        content = content.replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br>")
        st.markdown(f"<div class='{role_class}'>{content}</div>", unsafe_allow_html=True)
    st.markdown("</div></div>", unsafe_allow_html=True)

col1, col2 = st.columns([1, 3])
with col1:
    if st.button("Clear Chat", key="clear"):
        st.session_state.messages = []
        st.experimental_rerun()

with st.container():
    render_chat()

st.markdown("---")

# Input form to capture Enter key properly
with st.form(key="chat_form", clear_on_submit=False):
    user_input = st.text_input("💬 Ask Cupid AI anything about love & matches…", value=st.session_state.get("last_user_input", ""), key="user_input")
    submit = st.form_submit_button("Send 💌")

# Submit handling
if submit:
    text = user_input.strip()
    if text:
        # append user message immediately
        st.session_state.messages.append({"role": "user", "content": text})
        st.session_state.last_user_input = ""  # clear saved last input
        # show typing indicator by appending a temporary bot message
        st.session_state.messages.append({"role": "assistant", "content": "Cupid is typing 💭..."})
        # rerender so user sees their message + typing
        # note: we avoid infinite loop by not calling rerun until after response is fetched
        render_chat()
        # call backend
        try:
            with st.spinner("Cupid is thinking..."):
                res = requests.post(API_URL, json={"question": text}, timeout=300)
                if res.status_code == 200:
                    ans = res.json().get("answer", "No response from Cupid.")
                else:
                    ans = f"⚠️ Backend error: {res.status_code}"
        except Exception as e:
            ans = f"⚠️ Error: {e}"

        # remove the typing indicator (last assistant message) and add real answer
        # ensure there's at least one assistant message to replace
        # find last index of assistant typing placeholder
        for i in range(len(st.session_state.messages) - 1, -1, -1):
            if st.session_state.messages[i].get("role") == "assistant" and st.session_state.messages[i].get("content", "").startswith("Cupid is typing"):
                st.session_state.messages.pop(i)
                break

        st.session_state.messages.append({"role": "assistant", "content": ans})
        # small pause for UX
        time.sleep(0.2)
        st.experimental_rerun()
    else:
        # keep the user's typed text in session for convenience
        st.session_state.last_user_input = user_input
        st.warning("Please type something before sending.")

# If user didn't press send but typed something, save it so Enter/refresh doesn't lose it
if not submit and st.session_state.get("user_input", ""):
    st.session_state.last_user_input = st.session_state.get("user_input", "")

# Footer / quick note
st.markdown(
    "<div style='text-align:center; margin-top:12px; color:#666;'>Tip: Use the 'Clear Chat' button to start over.</div>",
    unsafe_allow_html=True,
)


