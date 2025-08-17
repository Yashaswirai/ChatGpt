const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const { socketMiddleware } = require("../middlewares/auth.middleware");
const { generateResponse } = require("../services/Ai.service");
const messageModel = require("../models/message.model");

const connectSocketServer = (httpServer) => {
  const io = new Server(httpServer, {});
  // Use the socket middleware for authentication
  io.use(socketMiddleware);

  io.on("connection", (socket) => {
    socket.on("ai-message", async (data) => {
      const { chatId, content } = data;
      await messageModel.create({
        chatId,
        content,
        role: "user",
        sender: socket.user._id,
      });
      const chatHistory = await messageModel.find({ chatId });
      console.log("Chat history:", chatHistory);
      const response = await generateResponse(
        chatHistory.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        }))
      );
      await messageModel.create({
        chatId,
        content: response,
        role: "model",
        sender: socket.user._id,
      });
      socket.emit("ai-response", { chatId, response });
    });
  });

  return io;
};

module.exports = { connectSocketServer };
