<template>
  <el-table>
    <el-table-column prop="name" label="姓名"></el-table-column>
    <el-table-column prop="type" label="类型"></el-table-column>
    <el-table-column prop="price" label="价格"></el-table-column>
    <el-table-column prop="marketcap" label="姓名"></el-table-column>
    <el-table-column prop="supply" label="供给"></el-table-column>
    <el-table-column prop="volume" label="容量"></el-table-column>
    <el-table-column prop="holders" label="持有者"></el-table-column>
  </el-table>
</template>

<style lang="less" scoped>
</style>

<script>
import { graphene } from '~/components/graphene'

export default {
  mounted: async function () {
  }
}
</script>