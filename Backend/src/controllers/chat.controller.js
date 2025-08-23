const chatModel = require("../models/chat.model");

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

module.exports = {
    createChat,
    getChats
};
