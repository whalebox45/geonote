// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import OpenLayersMap from 'vue3-openlayers';
import 'vue3-openlayers/styles.css';
import './styles/global.scss';
import { setupLeafletIcons } from './utils/setupLeafletIcons';

setupLeafletIcons();

createApp(App).use(router).use(OpenLayersMap).mount('#app');

