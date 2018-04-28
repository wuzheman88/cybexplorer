const { Nuxt, Builder } = require('nuxt')
const express = require('express')
const logger = require('morgan')
var http = require('http')
const app = express()

const port = process.env.PORT || 3010

const server = http.createServer(app)
app.listen = function (app) {
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

// const socketio = require('socket.io')
// let io = socketio(server)

// let messages = []
// io.sockets.on('connection', (socket) => {
//   socket.on('last-messages', function (fn) {
//     fn(messages.slice(-50))
//   })
//   socket.on('send-message', function (message) {
//     messages.push(message)
//     socket.broadcast.emit('new-message', message)
//   })

//   socket.broadcast.emit('new-message', 'Hello new world!')
// })