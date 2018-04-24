// const WebSocket = require('ws')
import {Apis} from 'cybexjs-ws'

const NODE_LIST = [
  'wss://singapore-01.cybex.io/',
  'wss://bitshares.dacplay.org/ws'
]

let sCallback = function () {}

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

class Graphene {
  constructor () {
    this.callbacks = {}
  }

  start ({nodeid, callback}) {
    sCallback = callback
    Apis.instance(NODE_LIST[nodeid || 0], true).init_promise.then((res) => {
      Apis.instance().db_api().exec('set_subscribe_callback', [this.updateListener, true])
      // Apis.instance().db_api().exec('set_pending_transaction_callback', [this.transactionListener, true])
    })
  }

  registerListener (api, callback) {
    this.callbacks[api] = callback
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
      if (transaction.seller) {
        console.log(transaction)
        const users = await Apis.instance().db_api().exec('get_accounts', [[transaction.seller]])
        if (users && users.length > 0) {
          let trxObj = {
            name: users[0].name
          }
          const pricePairs = ['base', 'quote']
          for (const idx in pricePairs) {
            const assetName = pricePairs[idx]
            const assetObj = transaction.sell_price[assetName]
            const assets = await Apis.instance().db_api().exec('get_assets', [[assetObj.asset_id]])
            const asset = assets[0]
            trxObj[assetName] = {
              symbol: asset.symbol,
              precision: asset.precision,
              amount: assetObj.amount,
              description: asset.options.description,
              max_supply: asset.options.max_supply,
              max_market_fee: asset.options.max_market_fee,
              market_fee_percent: asset.options.market_fee_percent
            }
          }
          // console.log('console.log(trxObj):;', transaction)
          // const trx = await Apis.instance().db_api().exec( 'get_objects', [[transaction.id]])
          sCallback(trxObj)
        }
      }
    })
  }

  transactionListener (object) {
    // console.log('set_pending_transaction_callback:\n', object)
  }

  async query ({string, callback}) {
    const queryResults = []
    for (const type in SUGGEST_QUERY_LIST) {
      const method = SUGGEST_QUERY_LIST[type]
      const action = method.action
      const param = method.paramCb(string)
      try {
        const resp = await Apis.instance().db_api().exec(action, param)
        console.log('suggest:', string, type, param, resp)
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
        console.log('some error:', e)
      }
    }
    callback(queryResults)
  }

  async queryAccount (name) {
    const result = await Apis.instance().db_api().exec('get_account_by_name', [name])
    return result
  }

  async queryWitness (id) {
    const result = await Apis.instance().db_api().exec('get_objects', [id])
    return result
  }

  async queryBlock (blockNum) {
    const result = await Apis.instance().db_api().exec('get_block', [blockNum])
    return result
  }
}

// module.exports = Graphene
export var graphene = new Graphene()
