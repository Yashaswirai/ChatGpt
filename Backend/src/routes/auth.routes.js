const express = require('express');
const router = express.Router();
const {registerUser, loginUser, authUser} = require('../controllers/auth.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/status', authUser)

module.exports = router;