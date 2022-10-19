import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '' // 保存token字符串
  },
  getters: {
  },
  mutations: {
    // 保存token
    updateToken (state, val) {
      state.token = val
    }
  },
  actions: {
  },
  modules: {
  },
  // 配置vuex的插件
  plugins: [
    createPersistedState() // 调用函数 注入持久化插件
  ]
})

// vuex默认保存在内存中，所以刷新所有的值会回归初始化（无法做到持久化储存）
// 借助yarn add vuex-persistedstate@3.2.1这个包可以让vuex做持久化存储
