const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decoded.id);
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
}

const socketMiddleware = async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "")
    const token = cookies.token
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded) {
          // Attach user information to the socket object
          socket.user = await userModel.findById(decoded.id);
          next();
        } else {
          next(new Error("Unauthorized"))
        }
      } else {
        next(new Error("No token provided"))
      }
    } catch (error) {
      next(new Error("Unauthorized"))
    }
}

module.exports = { authMiddleware, socketMiddleware };