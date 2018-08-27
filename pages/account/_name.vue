<template>
  <div class="container">
    <el-row>
      <el-col :span="8">
        <h5>账户信息</h5>
        <ul>
          <li>
            账户名称<span>{{ accountInfo.name }}</span>
          </li>
          <li>
            账户ID<span>{{ accountInfo.id }}</span>
          </li>
          <li>
            等级<span>{{ accountInfo.level }}</span>
          </li>
        </ul>
      </el-col>
      <el-col :span="8">
        <h5>投资组合</h5>
        <ul>
          <li v-if="accountInfo.cashback_vb">
            资产<span><object-link :objectid="accountInfo.cashback_vb"></object-link></span>
          </li>
          <li v-if="accountInfo.statistics">
            历史统计<span>{{ accountInfo.statistics }}</span>
          </li>
        </ul>
      </el-col>
      <el-col :span="8">
        <h5>活动记录</h5>
        <ul>
          <li v-for="(operation, index) in accountHistory" :key="index">
            <span><operation-item :operation="operation"></operation-item></span>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { graphene } from '~/components/graphene'
import ObjectLink from '~/components/ObjectLink.vue'
import OperationItem from '~/components/OperationItem.vue'

export default {
  data () {
    return {
      accountInfo: {},
      accountHistory: {},
      committeMembers: null
    }
  },
  components: {
    ObjectLink,
    OperationItem
  },
  methods: {
  },
  async mounted () {
    await graphene.checkPeerConnection(WebSocket)
    this.accountInfo = await graphene.doQuery({
      type: 'account',
      string: this.$route.params.name
    })
    this.accountHistory = await graphene.queryAccountHistroy(this.accountInfo.id, 10)
    console.log('accountHistory: ', this.accountHistory)
    // const statistics = this.accountInfo.statistics
    // // const result = await graphene.queryObject(statistics)
    // console.log('account statistics', statistics, JSON.stringify(this.accountInfo))
  }
}
</script>

<style>
.box-card {
  width: 100%;
  margin-top: 35px;
}
</style>
