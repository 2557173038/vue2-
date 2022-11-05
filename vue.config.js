const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // 解决 WebSocketClient.js?5586:16
  //  WebSocket connection to 'ws://10.23.214.219:8080/ws' failed:   bug
  devServer: {
    host: '0.0.0.0',
    // https:true,
    port: 8080,
    client: {
      webSocketURL: 'ws://0.0.0.0:8080/ws'
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  transpileDependencies: true,
  // ./可以让开发环境和生产环境都能正常使用
  // 为了严谨一点
  // 开发环境: '/'
  // 生产环境: './'
  // 问题:有无代码可以让他自己识别当前运行环境
  // node里有个内置的环境变量process.eav.NODE_ENV
  // rocess.eav.NODE_ENV 他会根据你敲击的命令，来使用不同的值
  // 解决：
  // 如果你敲击的是yarn serve rocess.env.NODE_ENV的值就是development字符串
  // 如果你敲击的是yarn build rocess.env.NODE_ENV的值就是production字符串
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/'
})
