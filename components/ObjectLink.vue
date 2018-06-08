<template>
  <el-tooltip class="item" effect="dark" placement="right-start">
    <div slot="content">
      <div v-if="type==='account'">
        <p>id：{{objData.id}}</p>
        <p>等级：{{objData.level}}</p>
        <p>等级：{{objData.level}}</p>
        <p>等级：{{objData.level}}</p>
        <p>等级：{{objData.level}}</p>
        <p>等级：{{objData.level}}</p>
      </div>
      <div v-if="type==='asset'">
        <p>id：{{objData.id}}</p>
        <asset-chart v-if="objData.id" :data="{
          base: objData.id,
          quote: '1.3.0',
          snapshot: true
        }"></asset-chart>
      </div>
      <div v-if="type==='asset_dynamic_data'">
        <p>隐私供给：{{objData.confidential_supply}}</p>
      </div>
    </div>
    <p v-if="type === 'asset_dynamic_data'">{{displayName}}</p>
    <div v-if="type === 'committee member'">
      <nuxt-link class="obj-link" :to="routeNext">{{displayName}}</nuxt-link>
      <p style="float:right">{{(objData.total_votes / 1000000).toFixed(1)}}M</p>
    </div>
    <p v-if="type === 'vesting balance'">{{`${objData.amount} ${displayName}`}}</p>
    <div v-if="type==='account_statistics_object'">
      <p>手续费总支出：{{objData.lifetime_fees_paid}}</p>
      <p>待结费用：{{objData.pending_fees}}</p>
      <p>待解冻金额：{{objData.pending_vested_fees}}</p>
      <p>总操作数：{{objData.total_ops}}</p>
      <p>取消操作数：{{objData.removed_ops}}</p>
    </div>
    <nuxt-link v-else class="obj-link" :to="routeNext">{{displayName}}</nuxt-link>
  </el-tooltip>
</template>

<style lang="less" scoped>
.obj-link {
  margin-right: 4px;
  margin-left: 4px;
}

div {
  display: inline-block;
}
</style>


<script>
import AssetChart from '~/components/AssetChart.vue'
import { graphene } from '~/components/graphene'
const config = require('../nuxt.config.js')

const RULE_TABLE = {
  '1.1': 'base',
  '1.2': 'account',
  '1.3': 'asset',
  '1.4': 'force settlement',
  '1.5': 'committee member',
  '1.6': 'witness',
  '1.7': 'limit order',
  '1.8': 'call order',
  '1.9': 'custom',
  '1.10': 'proposal',
  '1.11': 'operation history',
  '1.12': 'withdraw permission',
  '1.13': 'vesting balance',
  '1.14': 'worker',
  '1.15': 'balance',
  '2.0': 'global_property_object',
  '2.1': 'dynamic_global_property_object',
  '2.3': 'asset_dynamic_data',
  '2.4': 'asset_bitasset_data',
  '2.5': 'account_balance_object',
  '2.6': 'account_statistics_object',
  '2.7': 'transaction_object',
  '2.8': 'block_summary_object',
  '2.9': 'account_transaction_history_object',
  '2.10': 'blinded_balance_object',
  '2.11': 'chain_property_object',
  '2.12': 'witness_schedule_object',
  '2.13': 'budget_record_object',
  '2.14': 'special_authority_object'
}

export default {
  props: {
    objectid: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      target: '',
      objData: {}
    }
  },
  components: {
    AssetChart
  },
  computed: {
    displayName () {
      const newName = this.objData ? this.objData.name || this.objData.symbol || this.objData.current_supply : ''
      // console.log('#####displayName', this.objData, newName)
      return newName
    },
    routeNext () {
      return `/${['witness', 'committee member'].indexOf(this.type) !== -1 ? 'account' : this.type.split(' ').join('_')}/${this.displayName}`
    },
    type () {
      const matched = /^([1-2]\.\d+)\.\d+$/.exec(this.objectid)
      // console.log('thie.objectid: ', this.objectid, matched)
      return matched ? RULE_TABLE[matched[1]] : 'account'
    }
  },
  async mounted () {
    const result = await graphene.queryObject(this.objectid)
    switch (this.type) {
      case 'witness':
        const witnessAccounts = await graphene.queryObject(result[0].witness_account)
        this.objData = witnessAccounts[0]
        break
      case 'asset':
        this.objData = result[0]
        break
      case 'asset_dynamic_data':
        this.objData = result[0]
        break
      case 'vesting balance':
        const balance = result[0].balance
        const resultBalance = await graphene.queryObject(balance.asset_id)
        this.objData = resultBalance[0]
        this.objData.amount = balance.amount
        break
      case 'committee member':
        const committeeInfo = await graphene.queryObject(result[0].committee_member_account)
        this.objData = committeeInfo[0]
        this.objData.total_votes = result[0].total_votes
        break
      case 'account_statistics_object':
        this.objData = result[0]
        const recentOp = await graphene.queryObject(this.objData.most_recent_op)
        const operation = await graphene.queryObject(recentOp[0].operation_id)
        const opContent = await graphene.queryObject(operation[0].id)
        console.log('$$$$$$$$ this.objData account_statistics_object', opContent)
        this.objData.recentOption = opContent[0]
        // recentOption:
        // {
        //   "id": "1.11.7890145",
        //   "op": [4, {
        //     "fee": {
        //       "amount": 0,
        //       "asset_id": "1.3.0"
        //     },
        //     "order_id": "1.7.3220663",
        //     "account_id": "1.2.31038",
        //     "pays": {
        //       "amount": 8219400,
        //       "asset_id": "1.3.27"
        //     },
        //     "receives": {
        //       "amount": 2103336,
        //       "asset_id": "1.3.0"
        //     }
        //   }],
        //   "result": [0, {}],
        //   "block_num": 2819785,
        //   "trx_in_block": 9,
        //   "op_in_trx": 0,
        //   "virtual_op": 12632
        // }
        break
      default:
        this.objData = result[0]
        this.objData.statisticsInfo = await graphene.queryObject(this.objData.statistics)
        // console.log('final statisticsInfo', this.objData.statisticsInfo)
    }
    if (config.dev) {
      // console.log('ObjectLink', this.type, this.objData, result[0])
    }
  },
  updated () {
  }
}
</script>
