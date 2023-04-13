import io from 'socket.io-client';
const url = 'http://localhost:3000';

class SocketIo {
  constructor ({
    setTableList,
    setStatus
  }) {
    this.setTableList = setTableList;
    this.setStatus = setStatus;

    this.init();
  };

  init () {
    this.createSocketIo();
    this.bindEvent();
  };

  bindEvent () {
    this.socketIo.on('getTable', this.handleGetTable);
    this.socketIo.on('changeStatus', this.handleChangeStatus);
    this.socketIo.on('editTable', this.handleEditTable);
  };

  handleEditTable = ({
    index,
    field,
    editValue
  }) => {
    this.setTableList((tableList) => tableList.map(
      (item, idx) => {
        if (idx == index) {
          item[field] = editValue;
        };

        return item;
      }
    ))
  }

  handleChangeStatus = (status) => {
    this.setStatus(status);
  }

  handleGetTable = ({ tableData }) => {
    this.setTableList(tableData);
  };

  createSocketIo () {
    this.socketIo = io(url);
  };

  // 编辑 edit
  onChangeStatus = (isStatus) => {
    this.socketIo.emit('changeStatus', isStatus);
  };

  onEditTable = (data) => {
    this.socketIo.emit('editTable', data);
  }
};

export default SocketIo;