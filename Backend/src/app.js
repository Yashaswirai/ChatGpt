const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.get('/', (req, res) => {
    res.send('Welcome to the MERN-GPT API');
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
module.exports = app;