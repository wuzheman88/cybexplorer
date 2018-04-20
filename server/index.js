const { Nuxt, Builder } = require('nuxt')
const express = require('express')
const logger = require('morgan')
var http = require('http')
const io = require('socket.io-client')
const app = express()

const port = process.env.PORT || 3010
const server = http.createServer(app)
app.listen = function (app) {
  const socket = io.connect("wss://bitshares.dacplay.org/ws", {reconnect: true})
  console.log('create socket!!!', socket)
  // const ws = new WebSocket("wss://bitshares.dacplay.org/ws")
  // ws.onopen = () => {
  //   console.log('ws!!! open')  
  // }
  // ws.onerror = (error) => {
  //   console.log('ws!!!', error)  
  // }
  // ws.onmessage = (message) => {
  //   console.log('ws!!!', message)
  // }
  // ws.onclose = () => {
  //   console.log('ws!!! close')
  // }
  socket.on('connect', () => {
    console.log('socket connected!!')
  })
  socket.on('open', () => {
    console.log('socket opened!!')
  })
  socket.on('error', () => {
    console.log('socket error!!')
  })
  socket.on('message', () => {
    console.log('socket message!!')
  })
  return server.listen.apply(server, arguments)
}

app.use(logger('dev'))

// 传入配置初始化 Nuxt.js 实例
const config = require('../nuxt.config.js')
const nuxt = new Nuxt(config)

// 生产模式不需要 build
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

app.use(nuxt.render)
app.listen(port, () => { console.log(`Server is listening on http://localhost:${port}`) })
