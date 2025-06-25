import { createRouter, createWebHashHistory } from 'vue-router';
import LoginView from './views/LoginView.vue';
import HomeView from './views/HomeView.vue';
import NoteView from './views/NoteView.vue';
import ChatView from './views/ChatView.vue';
import RegisterView from './views/RegisterView.vue';

const routes = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/home', name: 'Home', component: HomeView },
  { path: '/note', name: 'Note', component: NoteView},
  { path: '/chat', name: 'Chat', component: ChatView}
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
