import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import router from '@/router';
import axios from 'axios';
import store from './store';
import common from '@/common/common';
import TheLayout from '@/layouts/TheLayout.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import myRipple from '@/directives/myRipple';

loadFonts();

const app = createApp(App);
app.component('TheLayout', TheLayout);
app.use(vuetify).use(ElementPlus).use(router).use(store).mount('#app');
app.directive('myRipple', myRipple);

app.config.globalProperties.$axios = axios;
app.config.globalProperties.$common = common;
