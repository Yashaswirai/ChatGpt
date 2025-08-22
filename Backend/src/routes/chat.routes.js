const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middlewares/auth.middleware');
const { createChat } = require('../controllers/chat.controller');

// POST /api/chat
router.post('/', authMiddleware, createChat)

module.exports = router;
