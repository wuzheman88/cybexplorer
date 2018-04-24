const { Nuxt, Builder } = require('nuxt')
const express = require('express')
const logger = require('morgan')
var http = require('http')
// const io = require('socket.io-client')
// const Graphene = require('../components/graphene.js')
const app = express()

const port = process.env.PORT || 3010

// const FLUSH_INTERVAL = 100

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

// const graphene = new Graphene()
// const flushLoop = setInterval(function () {
//   const msgList = graphene.flush()
//   console.log('latest transaction:', msgList)
// }, FLUSH_INTERVAL)