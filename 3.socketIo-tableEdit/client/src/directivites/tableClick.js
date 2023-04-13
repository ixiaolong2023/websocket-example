class TableClick {
  mounted = (el, binding) => {
    const {
      setStatus,
      setTableList,
      onChangeStatus,
      onEditTable
    } = binding.value;

    // 1. 绑定事件
    this.el = el;
    this.setStatus = setStatus;
    this.setTableList = setTableList;
    this.onChangeStatus = onChangeStatus;
    this.onEditTable = onEditTable;

    this.bindEvent();
  };

  bindEvent () {
    this.el.addEventListener('dblclick', this.handleTableClick, false);
    window.addEventListener('click', this.removeInput.bind(this), false);
    this.el.addEventListener('click',this.stopPropagation, false );
  };

  handleTableClick = (e) => {
    // 移除之前的 input
    this.removeInput();
    this.stopPropagation(e);

    let target = e.target,
        oTd = TableClick.getElTd(target);

    if (oTd) {
      this._index = oTd.dataset.index;
      this._field = oTd.dataset.field;
      this._value = oTd.dataset.value;
    };

    if (this._field) {
      // 创建 input
      this.oInput = TableClick.createInputEl(this._value);
      oTd.appendChild(this.oInput);
      this.oInput.select();
      this.oInput.addEventListener('input', this.handleInput, false);

      // 触发 ws
      this.onChangeStatus(true);
    }
  };

  handleInput = (e) => {
    const editValue = e.target.value.trim();

    // 触发 edit
    this.onEditTable({
      index: this._index,
      field: this._field,
      editValue,
    })
  };

  removeInput () {
    this.oInput && this.oInput.removeEventListener('input', this.handleInput, false);
    this.oInput && this.oInput.remove();
    this.oInput = null;

    this.onChangeStatus(false);
  }

  // 组织冒泡
  stopPropagation (e) {
    e.stopPropagation();
  };

  static createInputEl (value) {
    const oInput = document.createElement('input');
    oInput.value = value;

    oInput.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 90%;
      height: 80%;
    `

    return oInput;
  }

  static getElTd (target) {
    let parent = target,
        tagName = parent.tagName.toLowerCase();
    
    while(tagName !== 'td') {
      parent = parent.parentNode;
      tagName = parent.tagName.toLowerCase();

      if (tagName === 'html') {
        return null
      }
    };

    return parent;
  }
};

export default new TableClick();