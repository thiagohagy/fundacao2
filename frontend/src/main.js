
import Vue from 'vue';
import App from './App.vue';

import VueProgressBar from 'vue-progressbar';
import Toasted from 'vue-toasted';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import BootstrapVue from 'bootstrap-vue'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'

import './core/globalMixin';
import './core/filter';
import './assets/fontAwesome/faall.css';
import './assets/fontAwesome/fasolid.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import './assets/bootstrap.custom.min.css';
import './assets/custom.css';

import router from './core/router';
import store from './store/index';
import http from './core/http';
import money from 'v-money';
import VModal from 'vue-js-modal';
import VueTheMask from 'vue-the-mask';

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead)

library.add(fas);
Vue.prototype.$http = http;
Vue.config.productionTip = false;

Vue.use(VModal, { dynamic: true, injectModalsContainer: true });
Vue.use(BootstrapVue);
Vue.use(VueTheMask);

const toastOpts = { iconPack: 'fontawesome', position: 'top-right', duration: 5000, theme: 'outline', icon: { name: 'done', after: true }};
Vue.use(Toasted, toastOpts);

const moneyOpts = { decimal: ',', thousands: '.', prefix: 'R$ ', suffix: ' #', precision: 2, masked: false };
Vue.use(money, moneyOpts);

Vue.use(VueProgressBar, {
  color: 'blue',
  failedColor: 'red',
  height: '2px',
});

export default new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
