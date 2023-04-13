const HEART_TIME = 10 * 1000;
const HEART_MODE = { MESSAGE: 'MESSAGE', HEART_BEAT: 'HEART_BEAT' };

class HeartBeat extends WebSocket {
  constructor(url, options) {
    super(url);

    const { wsReconnect, loading, loaded } = options;

    this.wsUrl = url;
    this.heartBeatTimer = null;
    this.heartReply = false;
    this.wsReconnect = wsReconnect;
    this.loaded = loaded;

    // 连接 
    loading();

    this.init();
  }

  init() {
    this.bindEvent();
  }

  bindEvent() {
    this.addEventListener('open', this.handleOpen, false);
    this.addEventListener('message', this.handleMessage, false);
    this.addEventListener('close', this.handleClose, false);
    this.addEventListener('error', this.handleError, false);
  }

  // 建立 ws 连接
  handleOpen() {
    this.loaded();

    // 开启心跳
    this.readyState === 1 &&
      (this.heartBeatTimer = setInterval(() => {
        this.sendMsg({
          mode: HEART_MODE.MESSAGE,
          msg: '心跳机制!',
        });

        this.heartReply = false;
      }, HEART_TIME));
  }

  handleMessage(e) {
    const { mode, msg } = this.receiveMsg(e.data);
    console.log(mode, msg);

    switch (mode) {
      case HEART_MODE.MESSAGE:
        console.log('---接收到的服务端发送的消息：' + msg + '---');
        break;
      case HEART_MODE.HEART_BEAT:
        this.heartReply = true;
        console.log('---心跳消息：' + msg + '---');
        break;
    }
  }

  handleClose() {
    console.log('---客户端断开WS连接---');

    if (this.heartBeatTimer) {
      clearInterval(this.heartBeatTimer);
      this.heartBeatTimer = null;
    }

    // 重连
    this.reconnect();
  }

  handleError() {
    console.log('--客户端连接出现错误！--');

    // 出错断开连接
    this.close();
  }

  reconnect() {
    console.log('重新连接中...');
    // 没有回复
    !this.heartReply && this.wsReconnect();
  }

  // 发送文本消息
  sendMsg(message) {
    this.readyState === 1 && this.send(JSON.stringify(message));
  }

  // 接收到的消息
  receiveMsg(data) {
    return JSON.parse(data);
  }

  static create(url, options) {
    return new HeartBeat(url, options);
  }
}

export default HeartBeat;
