const { Server } = require('socket.io');
// 表格数据
const tableData = [
  {
    id: 1,
    name: '小红',
    age: 14,
    score: 80,
  },
  {
    id: 2,
    name: '小明',
    age: 22,
    score: 90,
  },
  {
    id: 3,
    name: '小龙',
    age: 21,
    score: 89,
  },
  {
    id: 4,
    name: '小花',
    age: 22,
    score: 79,
  }
]

class SocketIo {
  constructor(httpServer, options) {
    if (!httpServer) throw new Error('no httpServer');

    this.httpServer = httpServer;
    this.options = options;

    this.init();
  }

  init() {
    this.createServer();
    this.bindEvent();
  };

  bindEvent () {
    const { io } = this;

    io.on('connection', this.handleConnection);
  };

  handleConnection = (socket) => {
    const socketId = socket.id;

    socket.emit('getTable', {
      tableData,
    });
    
    socket.on('changeStatus', this.handleChangeStatus);
    socket.on('editTable', this.handleEditTable);
  };

  // 改变状态 - 提示正在编辑中
  handleChangeStatus = (status) => {
    SocketIo.ioEmit(this.io, 'changeStatus', status);
  };

  handleEditTable = (data) => {
    SocketIo.ioEmit(this.io, 'editTable', data);
  };

  // 创建 ws 服务
  createServer () {
    this.io = new Server(this.httpServer, this.options);
  };

  // 转发每一个客户端
  static ioEmit (io, type, data = {}) {
    io.emit(type, data);
  }
}

module.exports = SocketIo;
