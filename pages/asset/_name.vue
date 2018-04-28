<template>
  <div class="container">    
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>资产信息</h3>
      </div>
      <el-form v-if="assetInfo" label-width="120px">
        <el-form-item label="资产缩写">
          <h4>{{ assetInfo.symbol }}</h4>
        </el-form-item>
        <el-form-item label="资产ID">
          <h4>{{ assetInfo.id }}</h4>
        </el-form-item>
        <el-form-item v-if="assetInfo.options" label="最高交易费">
          <h4>{{ assetInfo.options.max_market_fee }}</h4>
        </el-form-item>
        <el-form-item v-if="assetInfo.issuer" label="发行人">
          <object-link :objectid="assetInfo.issuer"></object-link>
        </el-form-item>
        <el-form-item label="精度">
          <h4>{{ assetInfo.precision }}</h4>
        </el-form-item>
        <el-form-item v-if="assetInfo.dynamic_asset_data_id" label="当前供给">
          <object-link :objectid="assetInfo.dynamic_asset_data_id"></object-link>
        </el-form-item>
        <el-form-item v-if="assetInfo.options" label="最大供给">
          <h4>{{ assetInfo.options.max_supply }}</h4>
        </el-form-item>
      </el-form>
      <asset-chart v-if="assetInfo.id" :data="{
          base: assetInfo.id,
          quote: '1.3.0'
        }"></asset-chart>
    </el-card>
  </div>
</template>

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
    updateAssetInfo (res) {
      this.assetInfo = res[0]
    }
  },
  async mounted () {
    graphene.doQuery({
      type: 'asset',
      string: this.$route.params.name,
      callback: this.updateAssetInfo
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

.box-card {
  width: 80%;
  min-height: 100%;
}
</style>
