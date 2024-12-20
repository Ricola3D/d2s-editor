import { createApp } from 'vue'
import App from './components/App.vue'

import VueTippy from 'vue-tippy'

import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

import store from './store.mjs'

import utils from './utils'

window.uuid = utils.uuidv4()

createApp(App)
  .component('multiselect', Multiselect)
  .use(store)
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
