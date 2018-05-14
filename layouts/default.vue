<template>
  <el-container v-loading="isConnected">
    <el-header>
      <!-- <br/> -->
      <nuxt-link to="/"><img src="data:image/png;base64,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" style="margin: 0px 0px 0px 6px; height: 20px;">
      </nuxt-link>
      <div class="global-title">
        <nuxt-link style="color:white;text-decoration:none;" to="/"><div>Cybexplorer</div></nuxt-link>
      </div>
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
      <el-aside width="350px" style="margin-top: 35px;">
        <el-card class="bb-box-card" style="margin-top: 10px;">
          <div slot="header" class="clearfix">
            <h3>委员会成员</h3>
          </div>
          <el-form v-for="(memb, index) in committeMembers" :key="index" label-width="40px">
            <el-form-item :label="`${index + 1}.`">
              <object-link :objectid="memb"></object-link>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="bb-box-card" style="margin-top: 35px;">
          <div slot="header" class="clearfix">
            <h3>区块链信息</h3>
          </div>
          <el-form label-width="240px">
            <el-form-item v-for="(item, key, index) in blockParameters" :key="index" v-if="typeof item !== 'object'" :label="key">
              <p>{{item}}</p>
            </el-form-item>
          </el-form>
        </el-card>
      </el-aside>
      <!-- 内容部分 -->
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item, i) in $route.matched"
            :to="i < $route.matched.length-1 ? item.path : undefined"
            :key="item.path">
            {{ item.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <nuxt/>
      </el-main>
    </el-container>
    <!-- <canvas ref="dan_canvas" class="edit-modal">
        您的浏览器太旧了，推荐升级至弹幕浏览器
    </canvas> -->
  </el-container>
</template>

<style lang="less">
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

body {
  /* background-color: #29323e; */
  background-color: #737373;
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

.global-title {
  // text-align: center;
  display: inline-block;
  position: absolute;
  left: 45%;
  width: 10%;
  font-size: 1.5em;
}

.main-container {
  position: absolute;
  padding-top: 50px;
  min-height: 100%;
  width: 100%;
  margin-top: 25px;
}

.el-header {
  z-index: 2000;

  background-color: rgb(84, 92, 100);
  color: #fff;

  line-height: 50px;
  min-height: 110px;

  .userinfo {
    text-align: right;
    float: right;

    > span {
      margin-right: 10px;
    }
  }
}

.box-card {
  margin-top: 35px;
}

.container {
  /* min-height: 100vh; */
  min-height: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  margin-top: 20px;
}

.edit-modal {
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  z-index: 100;
}
</style>

<script>
import { Barrage } from '~/components/barrage.js'
import { graphene } from '~/components/graphene'
import io from 'socket.io-client'
import ObjectLink from '~/components/ObjectLink.vue'

let socket

export default {
  data () {
    return {
      isConnected: false,
      content: '',
      committeMembers: null
    }
  },
  components: {
    ObjectLink
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
          value: '',
          desc: '请输入账户名、区块号、交易hash'
        }]
        cb(json)
      }
    },
    handleSelect (item) {
      // this.content = item.value
      this.content = ''
      this.$router.push({
        path: `/${item.type}/${item.value}`,
        params: {
          name: item.value
        }
      })
    }
  },
  beforeMount () {
    // socket = io()
    // socket.on('connect', () => {
    //   console.log('connected!!')
    // })
    // socket.on('new-message', (message) => {
    //   this.danList.push(message)
    //   this.barrage.shoot(message)
    // })
  },
  async mounted () {
    const obj = this
    graphene.on('connected', function () {
      obj.isConnected = true
    })
    await graphene.start()
    const params = await graphene.queryGlobalProperties()
    obj.committeMembers = params.active_committee_members
    obj.blockParameters = params.parameters
    // let canvas = this.$refs.dan_canvas
    // canvas.width = document.documentElement.clientWidth
    // canvas.height = document.documentElement.clientHeight
    // this.barrage = new Barrage(canvas)
    // this.barrage.draw()
  }
}
</script>