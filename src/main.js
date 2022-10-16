import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/elementUI' // 让elementUI参与打包，才能在页面上注册插件
import '@/assets/global.less'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
