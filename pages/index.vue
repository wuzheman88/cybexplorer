<template>
  <div class="container">
    <div class="msgContainer">
      <h5>最新交易</h5>
      <br/>
      <ul>
        <li v-for="(msg, index) in actionList" class="account_action" :key="index">
          <object-link :objectid="msg.seller"></object-link>{{`wants ${msg.quote.amount}`}} <object-link :objectid="msg.quote.asset_id"></object-link> {{ `For ${msg.base.amount}`}} <object-link :objectid="msg.base.asset_id"></object-link>
          @<time-label :time="msg.timestamp"></time-label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import TimeLabel from '~/components/TimeLabel.vue'
import ObjectLink from '~/components/ObjectLink.vue'
import { graphene } from '~/components/graphene'

export default {
  data () {
    return {
      actionList: []
    }
  },
  components: {
    TimeLabel,
    ObjectLink
  },
  methods: {
    onNewAction (newMsg) {
      this.actionList.unshift(newMsg)
    }
  },
  mounted () {
    graphene.registerListener(this.onNewAction)
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

.msgContainer {
  text-align: left;
  padding:       4px 4px 4px 4px;
  margin-bottom: 5px;
  border:        1px solid #e3e3e3;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
  box-shadow:         inset 0 1px 1px rgba(0, 0, 0, 0.05);
  font-weight:   140;
  font-size:     0.95em;
  z-index:       10;
  /* position:      relative; */
  overflow:      hidden;
  /* line-height:   1.229; */
  min-width: 80%;
  height: 100%;
  float: right;
  background:    #FFF;
  margin-left: 100px;
  vertical-align: top;
  /* position: fixed;
  top: 20px; */
}

.msgContainer h5 {
  text-align: center;
  margin-top: 10px;
}

.account_action {
  /* background:    #888; */
  /* color:         #888; */
  border-radius: 2px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
  box-shadow:         inset 0 1px 1px rgba(0, 0, 0, 0.05);
  padding:       4px 4px 4px 27px;
  margin-bottom: 5px;
  line-height:   1.229;
  list-style:none;
}
</style>
