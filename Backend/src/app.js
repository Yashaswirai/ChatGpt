const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const path = require('path');

app.use(express.json());
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, '../public')));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// app.get('*name', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/index.html'));
// });
module.exports = app;