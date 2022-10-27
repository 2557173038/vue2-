import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout'), // 默认打开直接看到布局页
    redirect: '/home', // 导致路由规则数组再次匹配
    children: [
      // 侧边栏导航，点击会切换地址，路由导航靠数据请求回来铺设上去的
      // 所以你的路由规则要配合它保持一致
      {
        path: 'home',
        component: () => import('@/views/home/index')

      },
      {
        path: 'user-info',
        component: () => import('@/views/User/userInfo')
      },
      {
        path: 'user-avatar',
        component: () => import('@/views/User/userAvatar')
      }
    ]
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

const whiteList = ['/login', '/reg'] // 白名单 （无需登录可以访问的地址）

// 全局前置路由守卫
// 1：游览器第一次打开项目页面，会触发一次全局前置路由守卫
// 2：有token就证明登录了，无token未登录
// 3.：next()如果强制切换路由地址，会再次走路由守卫再次去匹配路由表
router.beforeEach((to, from, next) => {
  const token = store.state.token
  // console.log(1)
  if (token) {
    // 登录了
    if (!store.state.userInfo.username) {
    // 你现在本地有token值，才去请求用户信息
      store.dispatch('getUserInfoActions')
    }
    next()
  } else {
    // 未登录
    // 数组。include(值)作用：判断值是否在数组里出现过，出现过原地返回一个true
    if (whiteList.includes(to.path)) {
      // 未登录，可以访问的路由地址，则放行（路由全局前置守卫不会再再次触发了，而是匹配路由表，让组件挂载）
      next()
    } else {
      // next()强制切换到登录路径上
      next('/login')
    }
  }
})

export default router

// 退出登录，重新登录，只走组件相关代码 (异步dom切换，不会导致所有代码重新执行，App.vue不走)
// 效果不对：换个账号得重新请求用户数据
// 解决:
// 1.可以在登录页面，登录成功后，再发请求去拿到用户信息
// 2.可以在全局前置路由守卫中，写(路由跳转的时候，判断+获取)
