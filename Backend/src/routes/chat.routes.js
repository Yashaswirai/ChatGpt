const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  createChat,
  getChats,
  getChatById,
  updateChat,
  deleteChat,
} = require("../controllers/chat.controller");

router
  .route("/")
  .get(authMiddleware, getChats)
  .post(authMiddleware, createChat);

router
  .route("/:id")
  .get(authMiddleware, getChatById)
  .put(authMiddleware, updateChat)
  .delete(authMiddleware, deleteChat);

module.exports = router;
