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
    <p v-if="type === 'vesting balance'">{{`${objData.amount} ${displayName}`}}</p>
    <nuxt-link v-else class="obj-link" :to="routeNext">{{displayName}}</nuxt-link>
  </el-tooltip>
</template>

<style>
.obj-link {
  margin-right: 4px;
  margin-left: 4px;
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
      return this.objData ? this.objData.name || this.objData.symbol || this.objData.current_supply : ''
    },
    routeNext () {
      return `/${this.type === 'witness' ? 'account' : this.type}/${this.displayName}`
    },
    type () {
      const matched = /^([1-2]\.\d+)\.\d+$/.exec(this.objectid)
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
      default:
        this.objData = result[0]
        this.objData.statisticsInfo = await graphene.queryObject(this.objData.statistics)
        console.log('final statisticsInfo', this.objData.statisticsInfo)
    }
    if (config.dev) {
      console.log('ObjectLink', result, RULE_TABLE[0])
    }
  },
  updated () {
  }
}
</script>
