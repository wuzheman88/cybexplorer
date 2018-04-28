<template>
  <div class="container">
    <el-row style="width:100%;">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h3>账户信息</h3>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">清空</el-button> -->
          </div>
          <el-form v-model="accountInfo" label-width="80px">
            <el-form-item label="账户名称">
              <h4>{{ accountInfo.name }}</h4>
            </el-form-item>
            <el-form-item label="账户ID">
              <h4>{{ accountInfo.id }}</h4>
            </el-form-item>
            <el-form-item label="等级">
              <h4>{{ accountInfo.level }}</h4>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="8" :offset="1">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h3>投资组合</h3>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">清空</el-button> -->
          </div>
          <el-form v-model="accountInfo" label-width="80px">
            <el-form-item v-if="accountInfo.cashback_vb" label="资产">
              <object-link :objectid="accountInfo.cashback_vb"></object-link>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { graphene } from '~/components/graphene'
import ObjectLink from '~/components/ObjectLink.vue'

export default {
  data () {
    return {
      accountInfo: {}
    }
  },
  components: {
    ObjectLink
  },
  methods: {
    updateAccount (res) {
      this.accountInfo = res
    }
  },
  async mounted () {
    graphene.doQuery({
      type: 'account',
      string: this.$route.params.name,
      callback: this.updateAccount
    })
  }
}
</script>

<style>
/* div {
  width: 100%;
} */

.box-card {
  width: 100%;
  margin-top: 35px;
}
</style>
