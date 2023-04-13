import { createRouter, createWebHashHistory } from 'vue-router';
import ChatView from '../components/ChatView.vue';

const routes = [
  {
    path: '/chatview',
    component: ChatView,
  },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});