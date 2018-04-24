import Vue from 'vue'
import VueI18n from 'vue-i18n'
import moment from 'moment'
moment.locale('zh-cn')

Vue.use(VueI18n)

export default ({ app, store }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: store.state.i18n.locale,
    fallbackLocale: 'cn',
    messages: {
      'en': require('~/locales/en.json'),
      'cn': require('~/locales/cn.json')
    }
  })
}
