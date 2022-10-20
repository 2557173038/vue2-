import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout')
    // 默认打开直接看到布局页面
  },
  {
    path: '/reg',
    component: () => import('@/views/register/index')
    // webpack提供的import函数来路由懒加载导入组件
    // 路由懒加载，就是页面路由路径切换到、reg，采取加载对应组件代码
    // 好处：让首页加载文件体积更小，加载更快
  },
  {
    path: '/login',
    component: () => import('@/views/login/index')

  }

]

const router = new VueRouter({
  routes
})

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token) {
    // 你现在本地有token值，才去请求用户信息
    store.dispatch('getUserInfoActions')
  }

  next()
})

export default router

// 退出登录，重新登录，只走组件相关代码 (异步dom切换，不会导致所有代码重新执行，App.vue不走)
// 效果不对：换个账号得重新请求用户数据
// 解决:
// 1.可以在登录页面，登录成功后，再发请求去拿到用户信息
// 2.可以在全局前置路由守卫中，写(路由跳转的时候，判断+获取)
