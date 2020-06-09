import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Router from "vue-router"
import store from './store'

Vue.config.productionTip = false
Vue.use(Router);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
