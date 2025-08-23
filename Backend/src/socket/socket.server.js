const { Server } = require("socket.io");
const { socketMiddleware } = require("../middlewares/auth.middleware");
const { generateResponse, generateVector } = require("../services/Ai.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/Vector.service");

const connectSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });
  // Use the socket middleware for authentication
  io.use(socketMiddleware);

  io.on("connection", (socket) => {
    socket.on("ai-message", async (data) => {
      const { chatId, content } = data;

  const [message, vector] = await Promise.all([
       messageModel.create({
         chatId,
         content,
         role: "user",
         sender: socket.user._id,
       }),
       generateVector(content)
     ]);
  // bump chat updated time
  try { require("../models/chat.model").findByIdAndUpdate(chatId, { $set: { updatedAt: new Date() } }).exec(); } catch {}
      await createMemory({
        vector,
        messageId: message._id,
        metadata: {
          user: socket.user._id,
          chatId,
          content,
          role: "user",
        },
      });

      const [memory, chatHistory] = await Promise.all([
        queryMemory({
          vector,
          metadata: {
            user: socket.user._id,
            chatId,
            content,
            role: "user",
          },
        }),
        messageModel
          .find({ chatId })
          .sort({ createdAt: -1 })
          .limit(7)
          .lean()
      ]);
      chatHistory.reverse();
      // Long Term Memory
      const LTM = [
        {
          role: "model",
          parts: [
            {
              text: `You are a helpful AI assistant. You have access to the following information from previous conversations: ${memory
                .map((m) => m.metadata.content)
                .join(" \n")}`,
            },
          ],
        }
      ]
      // Short Term Memory
      const STM = chatHistory.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));

      const prompt = [...LTM, ...STM];
      const response = await generateResponse(prompt);      
      socket.emit("ai-response", { chatId, response });
      // Save the response message in mongodb and in vector data base
  const [resMessage,resVector] = await Promise.all([
        messageModel.create({
          chatId,
          content: response,
          role: "model",
          sender: socket.user._id,
        }),
        generateVector(response)
      ]);
  try { require("../models/chat.model").findByIdAndUpdate(chatId, { $set: { updatedAt: new Date() } }).exec(); } catch {}
      await createMemory({
        vector: resVector,
        messageId: resMessage._id,
        metadata: {
          user: socket.user._id,
          chatId,
          content: response,
          role: "model",
        },
      });
    });
  });

  return io;
};

module.exports = { connectSocketServer };
