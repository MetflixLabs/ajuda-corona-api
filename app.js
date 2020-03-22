const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketio = require('socket.io');
const interval = require('interval-promise');
const get = require('./api.js');

const app = express();
const server = http.createServer(app);
const io = socketio().listen(server);

app.use(cors());
// app.use(cors({ credentials: true, origin: 'https://www.ajudacorona.com.br' }));
app.use(helmet());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.header('origin'));
  next();
});

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

server.listen(process.env.PORT || 5000);
