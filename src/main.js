import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import router from '@/router';
import axios from 'axios';
import store from './store';
import common from '@/common/common';
import TheLayout from '@/layouts/TheLayout.vue';

loadFonts();

const app = createApp(App);
app.component('TheLayout', TheLayout);
app.use(vuetify).use(router).use(store).mount('#app');

app.config.globalProperties.$axios = axios;
app.config.globalProperties.$common = common;
