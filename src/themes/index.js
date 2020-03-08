import * as loginTheme from './login'

export default {
  install(Vue) {
    if(Vue.prototype.$themes && typeof Vue.prototype.$themes === 'object') return

    Vue.prototype.$themes = {
      loginTheme
    }
  }
}