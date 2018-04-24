<template>
  <div class="container">    
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>账户信息</h3>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">清空</el-button> -->
      </div>
      <!-- <el-form v-model="blockInfo" label-width="120px">
        <el-form-item label="账户名称">
          <h4>{{ accountInfo.name }}</h4>
        </el-form-item>
        <el-form-item label="账户id">
          <h4>{{ accountInfo.id }}</h4>
        </el-form-item>
        <el-form-item label="等级">
          <h4>{{ accountInfo.level }}</h4>
        </el-form-item>
      </el-form> -->
    </el-card>
  </div>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'
import { graphene } from '~/components/graphene'

export default {
  data () {
    return {
      blockInfo: {}
    }
  },
  components: {
    AppLogo
  },
  methods: {
  },
  async mounted () {
    this.blockInfo = await graphene.queryBlock(this.$route.params.name)
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: scroll;
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
</style>
