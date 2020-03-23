const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketio = require('socket.io');
const interval = require('interval-promise');
const get = require('./api.js');

const app = express();
const server = http.createServer(app);
const io = socketio({ path: '/corona/wp' }).listen(server);

app.use(cors());
app.use(helmet());

let balance = '-';

io.on('connection', socket => {
  socket.emit('serverData', {
    balance,
    onlineUsers: Object.keys(io.sockets.sockets).length,
  });
});

interval(async () => {
  try {
    const res = await get('/site');
    const { reward } = res.message;

    balance = reward;

    io.emit('serverData', {
      balance,
      onlineUsers: Object.keys(io.sockets.sockets).length,
    });
  } catch (error) {
    throw new Error(error);
  }
}, 5000);

app.get('/corona/testEndpoint', (req, res) => {
  res.json({ test: 'return test' });
});

server.listen(process.env.PORT || 5000);
