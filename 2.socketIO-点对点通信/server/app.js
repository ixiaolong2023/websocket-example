const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

let userList = [];

io.on('connection', (socket) => {
  console.log('客户端建立连接');
  const socketId = socket.id,
        query = socket.handshake.query;

  userList = addUserList(userList, socketId, query);

  // 通知每一个客户端
  io.emit('online', { userList });

  // 发送过来的消息
  socket.on('sendMsg', ({
    msgInfo
  }) => {
    // 根据 socket 的 id 找到发送给哪一个客户端
    const targetSocket = findTargetSocket({
      io,
      id: msgInfo.id,
    });

    targetSocket.emit('receiveMsg', {
      msgInfo,
    })
  })
});


httpServer.listen(8000, () => {
  console.log('服务器启动在8000端口！');
});

function findTargetSocket ({ id, io }) {
  return io.sockets.sockets.get(id);
}

function addUserList (userList, sId, query) {
  const username = query.username;

  const user = userList.find(user => user.username === username);

  if (user) {
    user.id = sId;
  } else {
    userList.push({
      id: sId,
      username: query.username,
      onlineTime: new Date().toString(),
    });
  };

  return userList;
}