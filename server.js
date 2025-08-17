require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');
const http = require("http");
const { connectSocketServer } = require('./src/socket/socket.server');

connectDB();

const port = process.env.PORT || 3000;
const httpServer = http.createServer(app);
connectSocketServer(httpServer);

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});