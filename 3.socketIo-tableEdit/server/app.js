const express = require('express');
const { createServer } = require('http');
const SocketIo = require('./SocketIO');

const app = express();

const httpServer = createServer(app);

const socketIo = new SocketIo(httpServer, {
  cors: {
    origin: ['http://127.0.0.1:5173'],
  },
});

httpServer.listen(3000, () => {
  console.log('服务启动在3000端口!')
});
