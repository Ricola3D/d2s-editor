import { createApp } from 'vue'
import App from './components/App.vue'

import VueTippy from 'vue-tippy'

// import Multiselect from 'vue-multiselect';
// import 'vue-multiselect/dist/vue-multiselect.min.css';

import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

import utils from './utils.js'

window.uuid = utils.uuidv4()

createApp(App)
    .component('multiselect', Multiselect)
    .use(
        VueTippy,
        // optional
        {
            directive: 'tippy', // => v-tippy
            component: 'tippy', // => <tippy/>
            componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
            defaultProps: {
                placement: 'auto-end',
                allowHTML: true,
            }, // => Global default options * see all props
        }
    )
    .mount('#app')
