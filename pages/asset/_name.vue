<template>
  <div class="container">    
    <div class="box-card">
      <div style="text-align:center;">
        <h3>资产信息</h3>
      </div>
      <ul v-if="assetInfo" label-width="120px">
        <li><span>资产缩写</span><div>{{ assetInfo.symbol }}</div></li>
        <li><span>资产ID</span><div>{{ assetInfo.id }}</div></li>
        <li v-if="assetInfo.options"><span>最高交易费</span><div>{{ assetInfo.options.max_market_fee }}</div></li>
        <li v-if="assetInfo.issuer"><span>发行人</span><div><object-link :objectid="assetInfo.issuer"></object-link></div></li>
        <li><span>精度</span><div>{{ Math.pow(10, assetInfo.precision) }}</div></li>
        <li v-if="assetInfo.dynamic_asset_data_id"><span>当前供给</span><div><object-link :objectid="assetInfo.dynamic_asset_data_id"></object-link></div></li>
        <li v-if="assetInfo.options"><span>最大供给</span><div>{{ assetInfo.options.max_supply }}</div></li>
      </ul>
      <asset-chart v-if="assetInfo.id" :data="{
          base: assetInfo.id,
          quote: '1.3.0'
        }"></asset-chart>
    </div>
  </div>
</template>

<style lang="less" scoped>
li {
  line-height: 1.8em;
}

li div {
  float: right;
}

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

.box-card {
  width: 100%;
  min-height: 100%;
  background: #7F8C98;
}
</style>

<script>
import ObjectLink from '~/components/ObjectLink.vue'
import AssetChart from '~/components/AssetChart.vue'
import { graphene } from '~/components/graphene'
import echarts from 'echarts'

export default {
  data () {
    return {
      assetInfo: {}
    }
  },
  components: {
    ObjectLink,
    AssetChart
  },
  methods: {
  },
  async mounted () {
    await graphene.checkPeerConnection(WebSocket)
    const res = await graphene.doQuery({
      type: 'asset',
      string: this.$route.params.name
    })
    this.assetInfo = res[0]
  }
}
</script>
