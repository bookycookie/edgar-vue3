/* eslint-disable vue/no-reserved-component-names */
/* eslint-disable vue/multi-word-component-names */
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

import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Menubar from 'primevue/menubar';
import Dropdown from 'primevue/dropdown';
import Divider from 'primevue/divider';
import Checkbox from 'primevue/checkbox';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Skeleton from 'primevue/skeleton';
import Textarea from 'primevue/textarea';
import InputSwitch from 'primevue/inputswitch';
import RadioButton from 'primevue/radiobutton';
import Tooltip from 'primevue/tooltip';
import Badge from 'primevue/badge';
import InputNumber from 'primevue/inputnumber';
import MultiSelect from 'primevue/multiselect';
import SelectButton from 'primevue/selectbutton';
import Chip from 'primevue/chip';
import BadgeDirective from 'primevue/badgedirective';
import Rating from 'primevue/rating';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import FileUpload from 'primevue/fileupload';
import Paginator from 'primevue/paginator';
import ToggleButton from 'primevue/togglebutton';
import Dialog from 'primevue/dialog';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import Calendar from 'primevue/calendar';
import Timeline from 'primevue/timeline';

import FontAwesomeIcon from './utilities/fontawesome/fontawesome-icons';

const app = createApp(App);
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);
app.component('Button', Button);
app.component('Accordion', Accordion);
app.component('AccordionTab', AccordionTab);
app.component('Menubar', Menubar);
app.component('Dropdown', Dropdown);
app.component('Divider', Divider);
app.component('Checkbox', Checkbox);
app.component('Tag', Tag);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('Card', Card);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Skeleton', Skeleton);
app.component('Textarea', Textarea);
app.component('InputSwitch', InputSwitch);
app.component('RadioButton', RadioButton);
app.component('Badge', Badge);
app.component('InputNumber', InputNumber);
app.component('MultiSelect', MultiSelect);
app.component('SelectButton', SelectButton);
app.component('Chip', Chip);
app.component('Rating', Rating);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('FileUpload', FileUpload);
app.component('Paginator', Paginator);
app.component('ToggleButton', ToggleButton);
app.component('Dialog', Dialog);
app.component('Toast', Toast);
app.component('Calendar', Calendar);
app.component('Timeline', Timeline);

app.use(router);
app.use(PrimeVue);
app.use(ToastService);
router.isReady().then(() => {
	app.mount('#app');
});
