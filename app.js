const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const socketio = require('socket.io');
const interval = require('interval-promise');
const get = require('./api.js');

const app = express();

app.use(cors({ credentials: true, origin: 'https://www.ajudacorona.com.br' }));
app.use(helmet());

const server = app.listen(process.env.PORT || 5000);
const io = socketio().listen(server);

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
