<template>
  <div class="container">    
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>区块信息</h3>
        <el-button @click="prevBlock">上一区块</el-button>
        <el-button @click="nextBlock">下一区块</el-button>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">清空</el-button> -->
      </div>
      <el-form v-if="blockInfo" v-model="blockInfo" label-width="120px">
        <el-form-item label="前一区块">
          <h4>{{ blockInfo.previous }}</h4>
        </el-form-item>
        <el-form-item label="Merkle树根节点">
          <h4>{{ blockInfo.transaction_merkle_root }}</h4>
        </el-form-item>
        <el-form-item label="生成时间">
          <time-label :time="blockInfo.timestamp"></time-label>
        </el-form-item>
        <el-form-item label="见证人">
          <object-link :objectid="blockInfo.witness"></object-link>
        </el-form-item>
        <el-form-item label="交易数">
          <h4>{{ blockInfo.transactions ? blockInfo.transactions.length : 0 }}</h4>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>交易信息</h3>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">清空</el-button> -->
      </div>
      <div v-for="(trxInfo, index) in trxList" :key="index">
      <el-form label-width="100px">
        <el-form-item label="操作">
          <h4>{{ trxInfo.action }}</h4>
        </el-form-item>
        <el-form-item v-if="trxInfo.content.from" label="来自">
          <object-link :objectid="trxInfo.content.from"></object-link>
        </el-form-item>
        <el-form-item v-if="trxInfo.content.to" label="发往">
          <object-link :objectid="trxInfo.content.to"></object-link>
        </el-form-item>
        <el-form-item label="费用">
          <span>{{ trxInfo.content.fee.amount }}<object-link :objectid="trxInfo.content.fee.asset_id"></object-link></span>
        </el-form-item>
        <el-form-item v-if="trxInfo.content.seller" label="卖家">
          <object-link :objectid="trxInfo.content.seller"></object-link>
        </el-form-item>
        <el-form-item v-if="trxInfo.content.amount_to_sell" label="卖出">
          <span>{{ trxInfo.content.amount_to_sell.amount }}<object-link :objectid="trxInfo.content.amount_to_sell.asset_id"></object-link></span>
        </el-form-item>
        <el-form-item v-if="trxInfo.content.min_to_receive" label="至少买">
          <span>{{ trxInfo.content.min_to_receive.amount }}<object-link :objectid="trxInfo.content.min_to_receive.asset_id"></object-link></span>
        </el-form-item>
        <el-form-item v-if="trxInfo.content.expiration" label="期限">
          <time-label :time="trxInfo.content.expiration"></time-label>
        </el-form-item>
      </el-form>
      <hr/>
      </div>
    </el-card>
  </div>
</template>

<script>
import TimeLabel from '~/components/TimeLabel.vue'
import ObjectLink from '~/components/ObjectLink.vue'
import { graphene } from '~/components/graphene'

export default {
  data () {
    return {
      blockInfo: null,
      trxList: [],
      blocknum: parseInt(this.$route.params.name)
    }
  },
  components: {
    TimeLabel,
    ObjectLink
  },
  methods: {
    updateBlockInfo (res) {
      // const self = this
      this.blockInfo = res
      const transactions = res.transactions
      if (transactions) {
        transactions.forEach((trx) => {
          const trxObj = {}
          trx.operations.forEach(op => {
            trxObj.action = op[0]
            trxObj.content = op[1]
          })
          this.trxList.push(trxObj)
        })
      }
    },
    prevBlock () {
      const newBlocknum = this.blocknum - 1
      this.$router.push({
        path: `/block/${newBlocknum}`,
        params: {
          name: newBlocknum
        }
      })
    },
    nextBlock () {
      const newBlocknum = this.blocknum + 1
      this.$router.push({
        path: `/block/${newBlocknum}`,
        params: {
          name: newBlocknum
        }
      })
    }
  },
  async mounted () {
    graphene.doQuery({
      type: 'block',
      string: this.blocknum,
      callback: this.updateBlockInfo
    })
  }
}
</script>

<style>

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.account_action {
  font-size: 1em;
  width: 100%;
}
</style>
