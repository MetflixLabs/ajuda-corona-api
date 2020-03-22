import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import socketio from 'socket.io';
import interval from 'interval-promise';

import { get } from './api.js';

const app = express();
const server = http.createServer(app);
const io = socketio().listen(server);

app.use(cors());
app.use(helmet());

let balance = '-';

io.on('connection', socket => {
  socket.emit('balance', balance);
});

interval(async () => {
  try {
    const res = await get('/site');
    const { reward } = res.message;

    balance = reward;

    io.emit('balance', balance);
  } catch (error) {
    throw new Error(error);
  }
}, 5000);

server.listen(process.env.PORT || 3000);
