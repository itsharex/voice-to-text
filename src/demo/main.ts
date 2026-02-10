import { createApp } from 'vue';
import { createPinia } from 'pinia';
import vuetify from '../plugins/vuetify';
import DemoApp from './DemoApp.vue';

const pinia = createPinia();
const app = createApp(DemoApp);

app.use(pinia);
app.use(vuetify);
app.mount('#app');
