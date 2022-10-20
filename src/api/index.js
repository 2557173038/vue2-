// 封装的是具体的接口请求方法
// 每个方法只负责请求一个URL地址

import request from '@/utils/request' // 引入自定义axios函数
import store from '@/store' // 引入store对象
// registerAPI(this.form)
//  registerAPI({
//     username: '',
//     password: '',
//     repassword: ''
// })
// 形参obj的值
// obj={ username: '',password: '值',repassword: ''}
// 左侧想要对象的解构赋值（语法↓）
// { username: 变量名,password:变量名 ,repassword: 变量名}={ username: '',password: '值',repassword: '' }
// 函数形参的obj就改成对象结构接受传入的数据对象
// key是传入对象的key匹配，value是变量名，用于接受外面传入的值
// key和value变量同名的时候。可以简写(key既为key也是value变量名)

// 导出接口方法 ，为了在逻辑页面引入调用

/**
 * 注册接口
 * @param {*} param0 {username:用户名，password：密码,repassword:确认密码}
 * @returns promise对象
 */
export const registerAPI = ({ username, password, repassword }) => {
  return request({
    url: '/api/reg',
    method: 'POST',
    // axios 传参params data
    // params的对象参数名和值,axios源码会把参数和值，拼接在url？后面给后台(query查询字符串)
    // data的对象参数名和值，axios源码会把参数和值，拼接在请求体里(body参数)
    data: {
      username,
      password,
      repassword

    }
  })
}
/**
 * 登录接口
 * @param {*} param0 {username:用户名，password：密码}
 * @returns promise对象
 */
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}

export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo',
    // method不写，默认get请求
    // 传参给后台：params（查询字符串quary），data（请求体），headers（请求头）
    headers: {
      // this.$store.state.token 这里this不是组件对象不能用this.strote拿到store对象
      Authorization: store.state.token
    }

  })
}
