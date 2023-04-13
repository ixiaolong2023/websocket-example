import HeartBeat from "./WebSocket/HeartBeat";

;(() => {
  var heartBeat,
      url = 'ws://localhost:8000';

  const init = () => {
    connect();
  };

  function connect () {
    heartBeat = HeartBeat.create(url, {
      wsReconnect,
      loading,  // 连接中
      loaded,  // 建立连接
    });
  };

  function loading () {
    console.log('连接中....');
  };

  function loaded () {
    console.log('建立 ws 连接');
  }

  function wsReconnect() {
    if (heartBeat.heartBeatTimer) {
      clearInterval(heartBeat.heartBeatTimer);
      heartBeat.heartBeatTimer = null;
    }

    connect();
  }

  btn1.onclick = () => {
    heartBeat.sendMsg({
      mode: 'MESSAGE',
      msg: 'hello websocket!',
    });
  };

  btn2.onclick = () => {
    heartBeat.close();
  };

  init();
})();