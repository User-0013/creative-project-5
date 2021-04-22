import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {initData} from './initial-values.js'

Vue.config.productionTip = false

let data = {
  user: null,
  initData
}

new Vue({
  router,
  data,
  render: h => h(App)
}).$mount('#app')
