<template>
  <div class="chat-view">
    <!-- 用户列表 -->
    <ul class="user-list-wrap">
      <li 
        v-for="item of state.userList"
        :key="item.id"
      >
        <span 
          v-if="item.username === selfName">
          {{ item.username }}
        </span>

        <a 
        v-else
        href="javascript:;" 
        @click="selectUser(item)"
        >
          {{ item.username }}
        </a>
      </li>
    </ul>
    <!-- 选择的用户信息 -->
    <div class="select-wrap">
      <h1>
        {{ state.selectUser.username || '请选择' }}
      </h1>
      <!-- 发送消息 -->
      <input 
        type="text" 
        placeholder="请输入消息" v-model="state.sendMsg"
      >
      <button @click="onSendMsg">发送</button>
    </div>
    <!-- 消息列表 -->
    <ul class="message-list-wrap">
      <li
        v-for="item of messageList"
        :key="item.id"
      >
        <p>用户名: {{ item.username }}</p>
        <p>消息：{{ item.msg }}</p>
        <p>发送时间：{{ item.sendTime }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { io } from "socket.io-client";
import { useRoute } from 'vue-router';
import { reactive, computed } from "vue";

const state = reactive({
  userList: [],  // 在线用户列表
  selectUser: {}, // 选择的用户信息
  sendMsg: '',
  messageBox: {},  // 用户发送数据列表
})

const route = useRoute();
const selfName = route.query.username;

const socket = io('http://localhost:8000', {
  query: {
    username: route.query.username,
  },
});

// 在线的用户
socket.on('online', ({ userList }) => {
  state.userList = userList;
});

// 选择的通信信息
const messageList = computed(() => {
  const selectUserName = state.selectUser.username;

  if (selectUserName) {
    return state.messageBox[selectUserName]
  }
});

const selectUser = (user) => {
  state.selectUser = user;
};

const onSendMsg = () => {
  const selectedId = state.selectUser.id,
        selectUsername = state.selectUser.username;
  if (!selectedId) return alert('请选择用户!');

  const msgInfo = {
    id: selectedId,  // 发送给哪一个客户端
    username: selfName,
    msg: state.sendMsg,
    sendTime: new Date().toString(),
  };

  state.messageBox[selectUsername] = [
    msgInfo,
    ...(state.messageBox[selectUsername] || [])
  ];

  // 发送数据
  socket.emit('sendMsg', {
    msgInfo,
  });
};

// 接收消息
socket.on('receiveMsg', ({ msgInfo }) => {
  const receiveUsername = msgInfo.username;

  state.messageBox[ receiveUsername ] = [
    msgInfo,
    ...(state.messageBox[ receiveUsername ] || []),
  ];
});
</script>

<style scoped>

</style>