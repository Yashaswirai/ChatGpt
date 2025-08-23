const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middlewares/auth.middleware');
const { createChat, getChats } = require('../controllers/chat.controller');

// POST /api/chat
router.post('/', authMiddleware, createChat)
router.get('/', authMiddleware, getChats)

module.exports = router;
