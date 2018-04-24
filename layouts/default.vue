<template>
  <el-container>
    <el-header height="110px" style="text-align:center;">
      <h1>Cybexplorer</h1>
      <p>A Cybex explorer</p>
      <br/>
      <el-row>
        <el-col :span="10" :offset="7">
        <el-autocomplete v-model="content" id="global_search_input" value-key="desc" :debounce="300" popper-class="suggestion_class" placeholder="请输入账户名、区块号、交易hash" clearable
          :fetch-suggestions="querySearchAsync" 
          @select="handleSelect">
          <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
        </el-autocomplete>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="main-container">
      <!-- 导航菜单 -->
      <el-aside width="200px">
      </el-aside>
      <!-- 内容部分 -->
      <el-main>
        <nuxt/>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

#global_search_input {
  width: 100%;
}

.suggestion-class {
  /* font-size: 32em; */
  color: red;
}
</style>

<script>
import { graphene } from '~/components/graphene'

export default {
  data () {
    return {
      content: ''
    }
  },
  methods: {
    onSearch () {
      this.$router.push('/')
    },
    querySearchAsync: function (queryString, cb) {
      if (queryString.trim().length > 0) {
        const string = queryString
        const callback = (x) => {
          cb(x)
        }
        graphene.query({string, callback})
      } else {
        const json = [{
          value: '可输入xxxxxx',
          desc: '可输入xxxxxx'
        }]
        cb(json)
      }
    },
    handleSelect (item) {
      this.content = item.value
      this.$router.push({
        path: `/${item.type}/${item.value}`,
        params: {
          name: item.value
        }
      })
    }
  }
}
</script>