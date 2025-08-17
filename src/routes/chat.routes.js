const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middlewares/auth.middleware');
const { createChat } = require('../controllers/chat.controller');

// GET /api/chat
router.get('/', authMiddleware, createChat)

module.exports = router;
