import { createRouter, createWebHashHistory } from 'vue-router';
import LoginView from './views/LoginView.vue';
import HomeView from './views/HomeView.vue';
import NoteView from './views/NoteView.vue';
import ChatView from './views/ChatView.vue';
import RegisterView from './views/RegisterView.vue';
import StoryBookView from './views/StoryBookView.vue';
import SettingsView from './views/SettingsView.vue';

const routes = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/home', name: 'Home', component: HomeView },
  { path: '/storybook', name: 'StoryBook', component: StoryBookView },
  { path: '/note/new', name: 'NoteNew', component: NoteView},
  { path: '/note/read/:uuid', name: 'NoteRead', component: NoteView, props: true},
  { path: '/note/edit/:uuid', name: 'NoteEdit', component: NoteView, props: true},
  { path: '/chat', name: 'Chat', component: ChatView},
  { path: '/settings', name: 'Settings', component: SettingsView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const publicPaths = ['/', '/register'];
  const token = localStorage.getItem('token');

  const isPublic = publicPaths.includes(to.path);
  const isLoggedIn = !!token;

  if (!isLoggedIn && !isPublic) {
    next('/');
  } else {
    next();
  }
});


export default router;
