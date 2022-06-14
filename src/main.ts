import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import axios from 'axios';

axios.defaults.withCredentials = true;

import PrimeVue from 'primevue/config';
// import 'primevue/resources/themes/fluent-light/theme.css';
// import 'primevue/resources/themes/md-light-indigo/theme.css';
import 'primevue/resources/themes/lara-light-blue/theme.css';
// import 'primevue/resources/themes/lara-dark-blue/theme.css';
// import 'primevue/resources/themes/md-dark-indigo/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import FontAwesomeIcon from './utilities/fontawesome/fontawesome-icons';

const app = createApp(App);
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.use(router);
app.use(PrimeVue);
router.isReady().then(() => {
	app.mount('#app');
});
