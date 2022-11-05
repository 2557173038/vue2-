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
  publicPath: './'
})
