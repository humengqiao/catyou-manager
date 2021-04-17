import App from './App.vue'
import router from '@/router'
import directives from '@/directives'
import filters from '@/filters'
import services from '@services'
import store from '@store'
import utils from '@utils'
import themes from '@themes'
import mourning_2020404 from '@/activitys/2020-04-04-mourning'
import './logo-printer'

Vue.use(directives)
Vue.use(filters)
Vue.use(services)
Vue.use(utils)
Vue.use(themes)
services.init()
mourning_2020404.bootstrap()

Vue.config.productionTip = false
Vue.config.$echarts = echarts

new Vue({
  router,
	store,
	render: h => h(App)
}).$mount('#app')


