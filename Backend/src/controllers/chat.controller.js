const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model");
const { deleteMemory } = require("../services/Vector.service");
const { generatePrompt } = require("../services/Ai.service");


const createChat = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user._id;
    const newChat = await chatModel.create({ userId, title });
    res.status(201).json({ message: "New Chat Created", chat: newChat });
  } catch (error) {
    res.status(500).json({ error: "Error creating chat message" });
  }
};

const getChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await chatModel
      .find({ userId })
      .sort({ updatedAt: -1 })
      .lean();
    res.status(200).json({ chats });
  } catch (error) {
    res.status(500).json({ error: "Error fetching chats" });
  }
};

const getChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const chat = await chatModel.findOne({ _id: id, userId });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.status(200).json({ chat });
  } catch (error) {
    res.status(500).json({ error: "Error fetching chat" });
  }
};

const updateChat = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { title } = req.body;
    const chat = await chatModel.findOneAndUpdate(
      { _id: id, userId },
      { title },
      { new: true }
    );
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.status(200).json({ message: "Chat updated", chat });
  } catch (error) {
    res.status(500).json({ error: "Error updating chat" });
  }
};

const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const [chat, messageIds] = await Promise.all([
      chatModel.findOneAndDelete({ _id: id, userId }),
      messageModel.find({ chatId: id }).distinct("_id"),
    ]);
    await Promise.all([
      messageModel.deleteMany({ chatId: id }),
      deleteMemory(messageIds),
    ]);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.status(200).json({ message: "Chat deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting chat" });
  }
};

async function getChatMessages(req, res) {
  try {
    const { id } = req.params; // chatId
    const userId = req.user._id;

    // Ensure the chat belongs to the requesting user
    const chat = await chatModel.findOne({ _id: id, userId }).lean();
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    let query = messageModel.find({ chatId: id }).sort({ createdAt: 1 });
    const messages = await query.lean();

    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching messages" });
  }
}

async function getPrompts(req, res) {
  try {
  const prompts = await generatePrompt();
  res.status(200).json({ prompts });
  } catch (error) {
  res.status(500).json({ message: "Error fetching prompts" });
  }
}

module.exports = {
  createChat,
  getChats,
  getChatById,
  updateChat,
  deleteChat,
  getChatMessages,
  getPrompts,
};
