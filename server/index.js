require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const connectDB = require("./db");
const Chat = require("./models/Chat");

const app = express();

// ✅ CORS FIX
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }),
);

app.use(express.json());

connectDB();

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// 🆕 CREATE NEW CHAT
app.post("/create-chat", async (req, res) => {
  try {
    const chat = new Chat();
    await chat.save();
    res.json(chat);
  } catch (err) {
    console.error("CREATE CHAT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📥 GET ALL CHATS
app.get("/chats", async (req, res) => {
  try {
    console.log("Fetching chats...");
    const chats = await Chat.find().sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error("CHAT FETCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 💾 SAVE MESSAGE (FIXED)
app.post("/save-message", async (req, res) => {
  try {
    const { chatId, message } = req.body;

    console.log("🔍 chatId:", chatId);
    console.log("📩 message:", message);

    // ✅ Validation
    if (!chatId) {
      return res.status(400).json({ error: "chatId missing ❌" });
    }

    if (!message || !message.role || !message.content) {
      return res.status(400).json({ error: "Invalid message ❌" });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found ❌" });
    }

    // ✅ Save message
    chat.messages.push(message);

    // ✅ Update title
    if (chat.title === "New Chat" && message.role === "user") {
      chat.title = message.content.slice(0, 30);
    }

    await chat.save();

    res.json(chat);
  } catch (err) {
    console.error("🔥 SAVE MESSAGE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🤖 CHAT WITH AI
app.post("/chat", async (req, res) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/agent", {
      message: req.body.message,
    });

    res.json({ reply: response.data.reply });
  } catch (err) {
    console.error("AI ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🚀 START SERVER
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
