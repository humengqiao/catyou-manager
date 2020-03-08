import Vue from 'vue'
import App from './App.vue'
import element from 'element-ui'
import echarts from 'echarts'
import router from '@/router'
import directives from '@/directives'
import filters from '@/filters'
import 'element-ui/lib/theme-chalk/index.css'
import services from '@services'
import store from '@store'
import utils from '@utils'
import themes from '@themes'

Vue.use(element)
Vue.use(directives)
Vue.use(filters)
Vue.use(services)
Vue.use(utils)
Vue.use(themes)
services.init()

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
