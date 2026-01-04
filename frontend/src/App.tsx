import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ChatWindow } from "./components/ChatWindow";
import { InputSection } from "./components/InputSection";
import { SuggestionChips } from "./components/SuggestionChips";
import { FloatingToolbar } from "./components/FloatingToolbar";
import { FloatingHearts } from "./components/FloatingHearts";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { LoveParticles } from "./components/LoveParticles";

import AdminKnowledge from "./pages/AdminKnowledge";

/* ===============================
   TYPES
================================ */

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface Chat {
  id: string;
  messages: Message[];
}

interface SidebarChat {
  id: string;
  title: string;
  time: string;
  hasHearts: boolean;
}

/* ===============================
   MAIN CHAT APP (YOUR UI)
================================ */

function ChatApp() {
  const [userId, setUserId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [sidebarChats, setSidebarChats] = useState<SidebarChat[]>([]);
  const [activeChatId, setActiveChatId] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  /* 🔐 Load user */
  useEffect(() => {
    const saved = localStorage.getItem("cupidUser");
    if (saved) {
      const user = JSON.parse(saved);
      setUserId(user.uid);
    }
  }, []);

  /* 📂 Load sidebar chats */
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/chat/list/${userId}`)
      .then(res => res.json())
      .then(data => {
        const list = data.map((c: any) => ({
          id: c._id,
          title: c.title || "New Chat",
          time: new Date(c.createdAt).toLocaleTimeString(),
          hasHearts: false
        }));

        setSidebarChats(list);

        if (!initialLoaded && list.length > 0) {
          loadChat(list[0].id);
          setInitialLoaded(true);
        }
      });
  }, [userId]);

  /* 📥 Load one chat */
  const loadChat = async (chatId: string) => {
    const res = await fetch(`http://localhost:5000/api/chat/${chatId}`);
    const chat = await res.json();

    const formatted: Chat = {
      id: chat._id,
      messages: chat.messages.map((m: any) => ({
        id: Math.random().toString(),
        text: m.text,
        sender: m.sender,
        timestamp: new Date(m.timestamp)
      }))
    };

    setChats(prev => {
      const exists = prev.find(c => c.id === formatted.id);
      if (exists) {
        return prev.map(c => (c.id === formatted.id ? formatted : c));
      }
      return [...prev, formatted];
    });

    setActiveChatId(chatId);
  };

  /* ➕ Create new chat */
  const handleNewChat = async () => {
    if (!userId) return;

    const res = await fetch("http://localhost:5000/api/chat/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });

    const chat = await res.json();

    setSidebarChats(prev => [
      { id: chat._id, title: "New Chat", time: "now", hasHearts: false },
      ...prev
    ]);

    setChats(prev => [...prev, { id: chat._id, messages: [] }]);
    setActiveChatId(chat._id);
  };

  /* 💬 Send message */
  const handleSendMessage = async (text: string) => {
    if (!userId) return;

    if (!activeChatId) {
      await handleNewChat();
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date()
    };

    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, userMsg] }
          : chat
      )
    );

    setIsTyping(true);

    const res = await fetch("http://localhost:5000/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        chatId: activeChatId,
        message: text
      })
    });

    const data = await res.json();

    const aiMsg: Message = {
      id: Date.now().toString(),
      text: data.reply,
      sender: "ai",
      timestamp: new Date()
    };

    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, aiMsg] }
          : chat
      )
    );

    setIsTyping(false);
  };

  const activeChat = chats.find(c => c.id === activeChatId);
  const messages = activeChat ? [...activeChat.messages] : [];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-pink-100 via-purple-50 to-rose-100">
      <AnimatedBackground />
      <FloatingHearts />
      <LoveParticles />

      <div className="relative z-10 flex h-full">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          sessions={sidebarChats}
          activeChatId={activeChatId}
          onNewChat={handleNewChat}
          onSelectChat={loadChat}
        />

        <div className="flex flex-1 flex-col">
          <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <ChatWindow messages={messages} isTyping={isTyping} />
          {messages.length <= 1 && (
            <SuggestionChips onSuggestionClick={handleSendMessage} />
          )}
          <InputSection onSendMessage={handleSendMessage} />
        </div>

        <FloatingToolbar />
      </div>
    </div>
  );
}

/* ===============================
   ROUTER
================================ */

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatApp />} />
      <Route path="/admin/knowledge" element={<AdminKnowledge />} />
    </Routes>
  );
}
