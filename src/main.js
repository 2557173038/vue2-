import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/elementUI' // 让elementUI参与打包，才能在页面上注册插件
import '@/assets/global.less'

import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.config.productionTip = false

Vue.use(VueQuillEditor) // 此方法内会用vue，component注册quilleditor名字全局组件

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
