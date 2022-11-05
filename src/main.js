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

import dayjs from 'dayjs'
// 基于dayjs封装一个全局函数来格式化事件(任意的组件可以直接使用$formatDate)
// 使用方法 $formatDate(dateObj)
Vue.prototype.$formatDate = (dateObj) => {
  // 借助dayjs内置的方法把日期对象格式化指定的格式，并把格式化好的字符串返回到调用处
  return dayjs(dateObj).format('YYYY-MM-DD HH:mm:ss')
}

Vue.config.productionTip = false

Vue.use(VueQuillEditor) // 此方法内会用vue，component注册quilleditor名字全局组件

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 前端：
// 前提：通过input[type=file]让用户选择文件，通过事件对象.target.files拿到用户选择的‘文件对象’
// 预览：img标签的src属性的值(baes64字符串 / 图片链接地址)
//    情况1:给src属性赋予baes64字符串(图片数据转base64字符串)，特点以data:image/png;base64，开头
//    文件转成图片base64字符串：new FileReader()

//    情况2：文件转成图片链接地址: URL.createObjURL(文件)
//    注意：他的地址只能在前端使用

// 需求：把用户选择的文件发给后台保存在服务器上
//      情况1：文件转成baes64字符串，传递给后套后台
//      情况2：用new FromData()表单数据直接装文件本身，直接传递给后台

// 后端返回图片地址的经验：
// 为何后端返回的图片地址是半截的
// 原因:因为服务器的域名可能会来回变化，所以数据库里的地址只有相对路径
// 要求：前端请求此图片的时候，后端告诉你图片文件真身所在服务器域名，前端自己拼接前缀

// 积累知识
// 组件创建时，会用data里的默认值，让template里标签先渲染一次
// 你的网络请求数据回来，data里的变量发生改变，会让template里使用变量的地方再次更新dom
// 小问题:第一次渲染的无值可能会导致一些报错，但是效果还是出来了
// 解决：v-if先不让template里报错的那个代码先屏蔽执行

// 打包相关问题：
// 问题：打开inde.html，出现了404问题
// 原因：
// 默认打包，index.html引入其他打包的文件使用的是 绝对地址
// 地址是以/开头(要找到当前index.html打开时所在服务器的根地址(根文件夹))
// 就得确保你的vscode+liveserve插件打开时，vscode目录得是dist文件夹
// 如果把dist文件交给后台运维工程师部署到服务器上，dist下内容就得在服务器根目录才行
// 但是服务器一般会有多个项目，不让你用根目录直接放一个项目，很乱
// 解决：webpack让你写一个配置项publicPath(控制index.html引入其他资源前缀地址)
// vue.config.js(脚手架配置文件,webpack配置文件)
// publiPath：默认值 '/' 确保开发环境下，是这个值，因为开发夫服务器会把所有打包在内存里而且会作为服务器的根目录文件夹
// 生产环境准备上线，这个时候，就得用相对路径 publicPath:'./'
