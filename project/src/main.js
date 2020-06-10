import Vue from 'vue'
// import App from './App.vue'
// import router from './router'
import router from './vue-router/router'
// import Router from "vue-router"
import Router from "./vue-router"
// import store from './store'
import store from "./vuex/store.js"
import App from "./vuex/components/App"

Vue.config.productionTip = false
Vue.use(Router);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
