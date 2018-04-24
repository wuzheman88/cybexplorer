<template>
  <div class="container">    
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>账户信息</h3>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">清空</el-button> -->
      </div>
      <el-form v-model="accountInfo" label-width="120px">
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
  </div>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'
import { graphene } from '~/components/graphene'

export default {
  data () {
    return {
      accountInfo: {}
    }
  },
  components: {
    AppLogo
  },
  methods: {
  },
  async mounted () {
    this.accountInfo = await graphene.queryAccount(this.$route.params.name)
  }
}
</script>

<style>
.box-card {
  width: 80%;
}
</style>
