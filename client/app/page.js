"use client";
import { useState, useEffect, useRef } from "react";
import ChatBubble from "../components/ChatBubble";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const currentChat = chats.find((c) => c._id === currentChatId);

  // 🔥 LOAD CHATS FROM DB
  const loadChats = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/chats");
      const data = await res.json();

      setChats(data);

      // ✅ Preserve current chat
      const exists = data.find((c) => c._id === currentChatId);

      if (exists) {
        setCurrentChatId(currentChatId);
      } else if (data.length > 0) {
        setCurrentChatId(data[0]._id);
      }
    } catch (err) {
      console.error("LOAD CHATS ERROR:", err);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  // 🔥 AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  // 🆕 CREATE CHAT
  const createNewChat = async () => {
    const res = await fetch("http://127.0.0.1:5000/create-chat", {
      method: "POST",
    });

    const newChat = await res.json();

    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat._id);
  };

  // 💬 SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Ensure chat exists
    if (!currentChatId) {
      await createNewChat();
      return;
    }

    const userMsg = {
      role: "user",
      content: input,
    };

    // ✅ Update UI (user)
    setChats((prev) =>
      prev.map((chat) =>
        chat._id === currentChatId
          ? { ...chat, messages: [...chat.messages, userMsg] }
          : chat,
      ),
    );

    setInput("");
    setLoading(true);

    // ✅ Save user message
    await fetch("http://127.0.0.1:5000/save-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: currentChatId,
        message: userMsg,
      }),
    });

    try {
      // 🤖 Get AI response
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const aiMsg = {
        role: "assistant",
        content: data.reply,
      };

      // ✅ Update UI (AI)
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === currentChatId
            ? { ...chat, messages: [...chat.messages, aiMsg] }
            : chat,
        ),
      );

      // ✅ Save AI message
      await fetch("http://127.0.0.1:5000/save-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: currentChatId,
          message: aiMsg,
        }),
      });

      // 🔥 REFRESH FROM DB (FIXES HISTORY ISSUE)
      await loadChats();
    } catch (err) {
      console.error("AI ERROR:", err);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
        createNewChat={createNewChat}
      />

      <div className="flex flex-col flex-1">
        <div className="p-4 border-b border-gray-800 text-lg font-semibold">
          AI Coding Mentor 🚀
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {currentChat &&
          currentChat.messages &&
          currentChat.messages.length > 0 ? (
            currentChat.messages.map((msg, i) => (
              <ChatBubble key={i} role={msg.role} content={msg.content} />
            ))
          ) : (
            <p className="text-gray-500">No messages yet</p>
          )}

          {loading && <p className="text-gray-400">Thinking...</p>}

          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-gray-800 flex gap-2">
          <textarea
            className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 outline-none resize-none"
            rows={1}
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 px-4 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
