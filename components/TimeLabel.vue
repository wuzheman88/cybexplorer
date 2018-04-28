<template>
  <span>{{timeString}}</span>
</template>

<script>
import moment from 'moment'
moment.locale('zh-cn')

export default {
  props: {
    time: {
      required: true,
      type: String
    },
    autoRefresh: {}
  },
  data () {
    return {
    }
  },
  computed: {
    timeString () {
      return moment(this.time).format('YYYY-MM-DD h:mm:ss')
    }
  }
}
</script>
