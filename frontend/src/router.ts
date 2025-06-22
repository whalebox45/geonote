import { createRouter, createWebHistory } from 'vue-router';
import LoginView from './views/LoginView.vue';
import StoryView from './views/StoryView.vue';
import NoteView from './views/NoteView.vue';
import ChatView from './views/ChatView.vue';
import RegisterView from './views/RegisterView.vue';

const routes = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/story', name: 'Story', component: StoryView },
  { path: '/note', name: 'Note', component: NoteView},
  { path: '/chat', name: 'Chat', component: ChatView}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
