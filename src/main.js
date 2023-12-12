import { createApp } from 'vue'
import App from './components/App.vue';

import select2 from './components/Select2.vue'
import Select2Directive from './Select2.js';
import Select2 from 'vue3-select2-component';
import utils from './utils.js';

window.uuid = utils.uuidv4();

createApp(App)
.component('Select2', Select2)
.component('select2', select2)
.directive('select', Select2Directive)
.mount('#app');