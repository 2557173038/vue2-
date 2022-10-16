// 封装的是具体的接口请求方法
// 每个方法只负责请求一个URL地址

import request from '@/utils/request' // 引入自定义axios函数

// 导出接口方法 ，为了在逻辑页面引入调用
export const registerAPI = () => {
  // 原地是一个promise对象（内部包含了原生ajax对象）
  // return这个promise对象到逻辑页面，去那边对promise对像提取结果
  return request({
    url: '/api/reg',
    method: 'POST',
    data: {
      username: 'xiao=ie7',
      password: '111111',
      repassword: '111111'
    }
  })
}
