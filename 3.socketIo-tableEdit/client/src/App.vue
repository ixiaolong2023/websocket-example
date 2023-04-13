<template>
  <div class="root-app">
    <h3>
      {{ status ? '正在修改中...' : '暂无修改' }}
    </h3>
    <table border="1" v-table-click="{
      setStatus,
      setTableList,
      onChangeStatus,
      onEditTable
    }">
      <thead>
        <tr>
          <th width="100">序号</th>
          <th width="100">姓名</th>
          <th width="100">年龄</th>
          <th width="100">分数</th>
        </tr>
      </thead>
      <tbody align="center">
        <tr
          v-for="(item, index) of tableList"
          :key="item.id"
          height="50"
        >
          <td>
            {{ item.id }}
          </td>
          <td :data-index="index" data-field="name" :data-value="item.name">
            <span>{{ item.name }}</span>
          </td>
          <td :data-index="index" data-field="age" :data-value="item.age">
            <span>{{ item.age }}</span>
          </td>
          <td :data-index="index" data-field="score" :data-value="item.score">
            <span>{{ item.score }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import SocketIo from './controllers/SocketIo';
import { useRef } from './libs/hooks';
import vTableClick from './directivites/tableClick';

const [ tableList, setTableList ] = useRef([]),
      [ status, setStatus ] = useRef(false);

const {
  onChangeStatus,
  onEditTable
} = new SocketIo({
  setTableList,
  setStatus
});
</script>

<style scoped>
td {
  position: relative;
}
</style>