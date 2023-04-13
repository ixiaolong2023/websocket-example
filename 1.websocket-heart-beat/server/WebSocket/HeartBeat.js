const WebSocket = require('ws');
const WS_MODE = {
  MESSAGE: "MESSAGE",
  HEART_BEAT: "HEART_BEAT"
};

class HeartBeat {
  constructor(options) {

    const { port } = options;

    this._options = options;

    this.init({
      port,
    });
  };

  init ({ port }) {
    this.createWsServer({ port }, () => {
      console.log('服务端 websocket 服务创建成功!');
    });
  }

  // 创建 ws 服务
  createWsServer({ port }, callback = () => {}) {
    this._wss = new this.Server({ port }, callback);

    this._wss.on('connection', this.handleConnection.bind(this));
  }

  handleConnection(ws) {
    console.log('客户端建立 ws 连接');
    this._ws = ws;

    this.addWsEvent('message', this.handleMessage);
    this.addWsEvent('error', this.handleError);
    this.addWsEvent('close', this.handleClose);
  };

  handleMessage (data) {
    const { mode, msg } = JSON.parse(data.toString());
    console.log(msg, mode);

    switch (mode) {
      case WS_MODE.MESSAGE:
          this.sendMsg({
            mode: WS_MODE.MESSAGE,
            msg,
          });
        break;
      case WS_MODE.HEART_BEAT:
        this.sendMsg({
          mode: WS_MODE.HEART_BEAT,
          msg,
        });
      default:
        break;
    }
  };

  handleClose () {
    this.sendMsg({
      mode: WS_MODE.MESSAGE,
      msg: '--Server Websocket is Closed!--',
    });

    console.log('websocket 关闭!');
  };

  handleError () {
    this.sendMsg({
      mode: WS_MODE.MESSAGE,
      msg: '--Server Websocket is Error!--',
    });

    console.log('websocket 出现错误!');
  }

  // ws.on 注册事件
  addWsEvent(type, callback = () => {}, target) {
    if (!this._ws || !type) return new Error('ws or type is not exist!');

    this._ws.on(type, callback.bind(target || this));
  };

  // 返回字符串 msg
  sendMsg (message) {
    this._ws.send(JSON.stringify(message));
  };

  get Server() {
    return WebSocket.Server;
  }

  static create(options) {
    return new HeartBeat(options);
  }
};

module.exports = HeartBeat;