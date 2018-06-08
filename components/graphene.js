import {Apis} from 'cybexjs-ws'
// const WebSocket = require('ws')
const config = require('../nuxt.config.js')

const NODE_LIST = [
  'wss://shanghai.51nebula.com/',
  'wss://beijing.51nebula.com/',
  'wss://hongkong.cybex.io/',
  'wss://tokyo-01.cybex.io/',
  'wss://korea-01.cybex.io/',
  'wss://singapore-01.cybex.io/'
]

// let sCallback = function () {}

const SUGGEST_QUERY_LIST = {
  account: {
    action: 'lookup_accounts',
    paramCb: s => { return [s, 1] },
    desc: '用户'
  },
  block: {
    action: 'get_block',
    paramCb: s => { return [s] },
    desc: '区块',
    isForbid: s => { return isNaN(s) }
  },
  asset: {
    action: 'lookup_asset_symbols',
    paramCb: s => { return [[s]] },
    desc: '资产'
  }
}

const DETAIL_QUERY_LIST = {
  account: {
    action: 'get_account_by_name',
    paramCb: s => { return [s] },
    desc: '用户'
  },
  block: {
    action: 'get_block',
    paramCb: s => { return [s] },
    desc: '区块',
    isForbid: s => { return isNaN(s) }
  },
  asset: {
    action: 'lookup_asset_symbols',
    paramCb: s => { return [[s]] },
    desc: '资产'
  }
}

let self

class Graphene {
  constructor () {
    this.callbacks = {}
    this.unhandledQueue = []
    this.currentNode = ''
    this.sCallback = null
    self = this
  }

  on (event, listener) {
    this['on' + event] = listener
  }

  async start () {
    const bestNode = await this.selectNode()
    await this.doConnect(bestNode)
  }

  async doConnect (cs) {
    Apis.setRpcConnectionStatusCallback(self.onConnectionStatusChanged)
    Apis.setAutoReconnect(true)
    return new Promise (function (resolve, reject) {
      Apis.instance(cs, true).init_promise.then(async (res) => {
        Apis.instance().db_api().exec('set_subscribe_callback', [self.updateListener, true])
        // Apis.instance().db_api().exec('set_pending_transaction_callback', [this.transactionListener, true])
        while (self.unhandledQueue.length > 0) {
          const unhandled = self.unhandledQueue.shift()
          if (self.onconnected) {
            self.onconnected()
          }
          await self.execute(unhandled.action, unhandled.param, unhandled.callback)
        }
        resolve()
      })
    })
  }

  onConnectionStatusChanged (status) {
    if (config.dev) {
      console.log('TCP链路状态变化：', status)
    }
    if (status === 'closed') {
      Apis.close().then(self.start)
    } else if (status === 'open') {
      self.currentNode = this.ws.url
      console.log('成功连接节点：', self.currentNode)
    }
  }

  async selectNode () {
    let minDelay = Number.MAX_SAFE_INTEGER
    let minCs = null
    let idx = 0
    const WSocket = WebSocket
    let timeout = false
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (minCs) {
          idx = NODE_LIST.length
          timeout = true
          if (config.dev) {
            console.log('选取延迟最低的节点：', minCs, minDelay)
          }
          resolve(minCs)
        }
      }, 500)
      NODE_LIST.forEach((cs) => {
        // console.log('websocks', cs)
        const testSock = new WSocket(cs)
        const preTime = Date.now()
        testSock.onopen = () => {
          const delay = Date.now() - preTime
          if (config.dev) {
            console.log('延迟：', cs, delay)
          }
          if (!timeout) {
            if (delay < minDelay) {
              minDelay = delay
              minCs = cs
            }
            if (++idx === NODE_LIST.length) {
              if (config.dev) {
                console.log('选取延迟最低的节点：', minCs, minDelay)
              }
              resolve(minCs)
            }
          }
        }
      })
    })
  }

  registerListener (callback) {
    // this.callbacks[api] = callback
    this.sCallback = callback
  }

  unregisterListener (api) {
    delete this.callbacks[api]
  }

  async updateListener (obj) {
    // for (const id in this.callbacks) {
    //   const callback = this.callbacks[id]
    //   if (callback) {
    //     callback()
    //   }
    // }
    const transactions = obj[0]
    transactions.forEach(async transaction => {
      console.log('$$$$$$ transaction callback:', transaction)
      if (transaction.seller) {
        let trxObj = {
          seller: transaction.seller,
          timestamp: transaction.expiration,
          base: transaction.sell_price.base,
          quote: transaction.sell_price.quote
        }
        if (self.sCallback) {
          self.sCallback(trxObj)
        }
      }
    })
  }

  transactionListener (object) {
    // console.log('set_pending_transaction_callback:\n', object)
  }

  async doQuery ({type, string}) {
    const method = DETAIL_QUERY_LIST[type]
    const action = method.action
    const param = method.paramCb(string)
    if (self.currentNode) {
      return await self.execute(action, param)
    } else {
      return new Promise (function (resolve, reject) {
        self.unhandledQueue.push({
          param: param,
          action: action,
          callback: function (x) {
            resolve(x)
          }
        })
      })
    }
  }

  async query ({string, callback}) {
    const queryResults = []
    for (const type in SUGGEST_QUERY_LIST) {
      const method = SUGGEST_QUERY_LIST[type]
      const action = method.action
      const param = method.paramCb(string)
      try {
        const resp = await Apis.instance().db_api().exec(action, param)
        if (type === 'account') {
          const respData = resp || []
          respData.forEach(arr => {
            queryResults.push({
              value: arr[0],
              id: arr[1],
              type: type,
              desc: `${method.desc}: ${arr[0]} [id: ${arr[1]}]`
            })
          })
        } else if (type === 'block') {
          queryResults.push({
            value: string,
            id: string,
            type: type,
            desc: `${method.desc}: ${string}`
          })
        } else if (type === 'asset') {
          const respData = resp[0]
          queryResults.push({
            value: respData.symbol,
            id: string,
            type: type,
            desc: `${method.desc}: ${respData.symbol} [id: ${respData.id}]`
          })
        }
      } catch (e) {
        // console.log('some error:', e)
      }
    }
    callback(queryResults)
  }

  async queryAccountHistroy (accountid, limit) {
    const result = Apis.instance().history_api().exec( "get_account_history", [accountid, '1.11.0', limit, '1.11.0']).then((x)=>{
      console.log(JSON.stringify(x))
    })
    return result
  }

  async queryAccount (name) {
    const result = await Apis.instance().db_api().exec('get_account_by_name', [name])
    if (config.dev) {
      // console.log('queryAccount', result)
    }
    return result
  }

  async queryWitness (id) {
    const result = await Apis.instance().db_api().exec('get_objects', [id])
    if (config.dev) {
      // console.log('queryWitness', result)
    }
    return result
  }

  async execute (action, param) {
    const result = await Apis.instance().db_api().exec(action, param)
    if (config.dev) {
      // console.log('query', action, result)
    }
    // callback(result)
    return result
  }

  // async queryBlock (blockNum, callback) {
  //   if (self.currentNode) {
  //     self.exec('get_block', [blockNum], callback)
  //   } else {
  //     self.unhandledQueue.push({
  //       param: [blockNum],
  //       action: 'get_block',
  //       callback: callback
  //     })
  //   }
  // }

  async queryAsset (symbol) {
    const result = await Apis.instance().db_api().exec('lookup_asset_symbols', [[symbol]])
    if (config.dev) {
      // console.log('queryAsset', result)
    }
    return result
  }

  async queryObject (objectId) {
    let result
    try {
      result = await Apis.instance().db_api().exec('get_objects', [[objectId]])
    } catch (e) {
      // console.log('queryObject', e, objectId)
    }
    if (config.dev) {
      // console.log('queryObject', result)
    }
    return result
  }

  async queryMarketHistory (base, quote, start, end, callback) {
    const startISO = start.toISOString().slice(0, -5)
    const endISO = end.toISOString().slice(0, -5)
    const result = await Apis.instance().history_api().exec( "get_market_history", 
      [base, quote, 3600, startISO, endISO])
    const ticker = Apis.instance().db_api().exec("get_ticker", [base, quote])
    const subscribeCallback = function (x, y, z) {
      // console.log('subscribeCallback', x, y, z)
      callback()
    }
    Apis.instance().db_api().exec("subscribe_to_market", [subscribeCallback, base, quote])
    return {
      ticker: ticker,
      prices: result
    }
  }

  async queryGlobalProperties () {
    let globalParams
    try {
      globalParams = await Apis.instance().db_api().exec( "get_global_properties", [])
    } catch (e) {
      // console.log('queryGlobalProperties2', e)
    }
    return globalParams
  }
}

// module.exports = Graphene
export var graphene = new Graphene()
