import { createApp, ref } from 'vue';
import VueTippy from 'vue-tippy';
import Multiselect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css';

import * as d2s from '../lib/d2';

import { vanilla_constants_96 } from '../public/d2/vanilla_constants_96.bundle.js';
import { vanilla_constants_97 } from '../public/d2/vanilla_constants_97.bundle.js';
import { vanilla_constants_98 } from '../public/d2/vanilla_constants_98.bundle.js';
import { vanilla_constants_99 } from '../public/d2/vanilla_constants_99.bundle.js';
import { remodded_constants_98 } from '../public/d2/remodded_constants_98.bundle.js';
import { remodded_constants_99 } from '../public/d2/remodded_constants_99.bundle.js';

import App from './components/App.vue';
import store from './store.mjs';
import utils from './utils';

const app = createApp(App);

// A list of existing versions can be found here: https://github.com/WalterCouto/D2CE/blob/main/d2s_File_Format.md#versions.
d2s.setConstantData('vanilla', 0x60, vanilla_constants_96); //1.10-1.14d
d2s.setConstantData('vanilla', 0x61, vanilla_constants_97); //alpha? (D2R)
d2s.setConstantData('vanilla', 0x62, vanilla_constants_98); //2.4 (D2R)
d2s.setConstantData('remodded', 0x62, remodded_constants_98); //2.4 (D2R)
d2s.setConstantData('vanilla', 0x63, vanilla_constants_99); //2.5+ (D2R)
d2s.setConstantData('remodded', 0x63, remodded_constants_99); //2.5+ (D2R)

app.config.globalProperties.$d2s = d2s;
app.config.globalProperties.$uuid = utils.uuidv4();

const work_mod = ref('remodded');
const work_version = ref(99);
const palettes = ref({});
const clipboard = ref(null);
app.config.globalProperties.$work_mod = work_mod;
app.config.globalProperties.$work_version = work_version;
app.config.globalProperties.$palettes = palettes;
app.config.globalProperties.$clipboard = clipboard;
app.config.globalProperties.$getWorkConstantData = () => d2s.getConstantData(work_mod.value, work_version.value);

app
  // eslint-disable-next-line vue/multi-word-component-names
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
    },
  )
  .mount('#app');
