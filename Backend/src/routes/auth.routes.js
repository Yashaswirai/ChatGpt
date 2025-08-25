const express = require('express');
const router = express.Router();
const {registerUser, loginUser, authUser, logoutUser} = require('../controllers/auth.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/status', authUser);
router.get('/logout', logoutUser);

module.exports = router;