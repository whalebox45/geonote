import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import OpenLayersMap from 'vue3-openlayers';
import 'vue3-openlayers/styles.css';



// main.ts
import { setupLeafletIcons } from './utils/setupLeafletIcons';
setupLeafletIcons();


import './styles/global.scss';
createApp(App).use(router).use(OpenLayersMap).mount('#app');

