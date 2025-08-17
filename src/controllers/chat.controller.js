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

module.exports = {
    createChat
};
