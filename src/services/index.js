import * as productionService from './production'
import * as userService from './user'
import * as upcService from './upc'
import * as permissionService from './permission'
import * as navigationService from './navigation'
import * as fbaService from './fba'
import * as commonService from './common'
import * as leanCloudConfig from '@config/leancloud'
import * as env from '@utils/env'

const serviceMap = {
  productionService,
  userService,
  upcService,
  permissionService,
	navigationService,
	fbaService,
	commonService
}

const init = () => {
  // 初始化leancloud存储
  AV.init({
    ...(
      env.isDev ?
      leanCloudConfig.leancloudProd :
      env.isProd ?
      leanCloudConfig.leancloudProd :
      {}
    )
  })
}

export default {
  install(Vue) {
    const serviceKeys = Object.keys(serviceMap)
    serviceKeys.forEach(item => {
      if(!Vue.prototype.$service) {
        Vue.prototype.$service = {}
      }

      Vue.prototype.$service[item] = serviceMap[item]
    })
  },
  init,
  ...serviceMap
}
