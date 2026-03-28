const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: String,
  content: String,
});

const chatSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "New Chat",
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chat", chatSchema);
