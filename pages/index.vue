<template>
  <div class="container">
    <el-row>
        <el-col :span="6">
          <el-row class="sidebar" style="height:350px;">
            <h3>委员会成员</h3>
            <el-scrollbar style="height:300px;">
              <ul>
                <li v-for="(memb, index) in committeMembers" :key="index">
                  <br/>
                  {{`${index + 1}.`}}<object-link :objectid="memb"></object-link>
                </li>
              </ul>
            </el-scrollbar>
          </el-row>
          <el-row class="sidebar" style="height:350px;margin-top:5px;">
            <h3>区块链信息</h3>
            <el-scrollbar style="height:300px;">
              <ul>
                <li v-for="(item, key, index) in blockParameters" v-if="typeof item !== 'object'" :key="index">
                    {{key}}<span style="float:right;">{{item}}</span>
                </li>
              </ul>
            </el-scrollbar>
              <!-- <el-form label-width="240px">
                <el-form-item v-for="(item, key, index) in blockParameters" 
                  :key="index" v-if="typeof item !== 'object'" :label="key">
                  <p>{{item}}</p>
                </el-form-item>
              </el-form> -->
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row class="sidebar" style="height:600px;">
            <h3>最新交易</h3>
            <el-scrollbar style="height:500px;">
              <ul>
                <li v-for="(msg, index) in actionList" class="account_action" :key="index">
                  <object-link :objectid="msg.seller"></object-link>{{`wants ${msg.quote.amount}`}} <object-link :objectid="msg.quote.asset_id"></object-link> {{ `For ${msg.base.amount}`}} <object-link :objectid="msg.base.asset_id"></object-link>
                  @<time-label :time="msg.timestamp"></time-label>
                </li>
              </ul>
            </el-scrollbar>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row class="sidebar" style="height:350px;">
            <h3>近期活动</h3>
            <el-scrollbar style="height:300px;">
            </el-scrollbar>
          </el-row>
          <el-row class="sidebar" style="height:350px;margin-top:5px;">
            <h3>最近区块</h3>
            <el-scrollbar style="height:300px;">
            </el-scrollbar>
          </el-row>
        </el-col>
    </el-row>
  </div>
</template>

<style lang="less" scoped>
</style>

<script>
import TimeLabel from '~/components/TimeLabel.vue'
import ObjectLink from '~/components/ObjectLink.vue'
import { graphene } from '~/components/graphene'

const MAX_SHOW_TRANSACTION_NUM = 30

export default {
  data () {
    return {
      actionList: [],
      cacheList: [],
      blockParameters: null,
      committeMembers: null
    }
  },
  components: {
    TimeLabel,
    ObjectLink
  },
  methods: {
    onNewAction (newMsg) {
      this.actionList.unshift(newMsg)
      if (this.actionList.length > MAX_SHOW_TRANSACTION_NUM) {
        this.cacheList = this.cacheList.concat(this.actionList.splice(MAX_SHOW_TRANSACTION_NUM))
      }
    }
  },
  async mounted () {
    graphene.registerListener(this.onNewAction)
    await graphene.checkPeerConnection(WebSocket)
    
    const params = await graphene.queryGlobalProperties()
    this.committeMembers = params.active_committee_members
    this.blockParameters = params.parameters
  }
}
</script>

<style lang="less">
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

.msgContainer {
  text-align: left;
  margin-bottom: 5px;
  border:        1px solid #e3e3e3;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
  box-shadow:         inset 0 1px 1px rgba(0, 0, 0, 0.05);
  font-weight:   130;
  font-size:     0.65em;
  z-index:       10;
  overflow:      hidden;
  min-width: 100%;
  float: right;
  background:     #7F8C98;
  vertical-align: top;
  float: left;
  text-align: center;
  margin-top: 10px;
}

.account_action {
  border-radius: 2px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
  box-shadow:         inset 0 1px 1px rgba(0, 0, 0, 0.05);
  margin-bottom: 5px;
  line-height:   1.229em;
  list-style:none;
  margin-top: 2px;
}
</style>
