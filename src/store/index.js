import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoAPI } from '@/api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '', // 保存token字符串
    userInfo: {} // 保存用户信息（id,username,nikename,email）
  },
  getters: {
  },
  mutations: {
    // 保存token
    updateToken (state, newToken) {
      state.token = newToken
    },
    // 保存用户信息
    updateUserInfo (state, newUserInfo) {
      state.userInfo = newUserInfo
    }
  },
  actions: {
    // 请求用户信息
    async  getUserInfoActions (store) {
      const { data: res } = await getUserInfoAPI()
      console.log(res)
      store.commit('updateUserInfo', res.data)
    }
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
