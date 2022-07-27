import App from './App'
import Vue from 'vue'
import store from './store'
import './assets/css/index.scss'
import commonUtils from './utils'
import mixins from '@/mixins'

Vue.config.productionTip = false
Vue.prototype.$toast = commonUtils.toast
Vue.prototype.$loading = commonUtils.loading
Vue.prototype.$hideLoading = commonUtils.hideLoading
Vue.prototype.commonUtils = commonUtils
Vue.mixin(mixins)

App.mpType = 'app'
const app = new Vue({
  store,
  ...App
})
app.$mount()
