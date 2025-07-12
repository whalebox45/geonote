// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import OpenLayersMap from 'vue3-openlayers';
import 'vue3-openlayers/styles.css';
import './styles/global.scss';
import { setupLeafletIcons } from './utils/setupLeafletIcons';

import i18n from './i18n';

setupLeafletIcons();

createApp(App).use(router).use(OpenLayersMap).use(i18n).mount('#app');

