import * as dateUtils from './date'
import * as htmlUtils from './html'
import * as fileUtils from './file'
import * as envUtils from './env'

const commonUtils = {
  // 复制内容到剪切板
  copy(str) {
    let transfer = document.createElement('input')
    document.body.appendChild(transfer)
    transfer.value = str  // 这里表示想要复制的内容
    transfer.focus()
    transfer.select()
    if(document.execCommand('copy')) {
      document.execCommand('copy')
    }

    transfer.blur()
    document.body.removeChild(transfer)   
  },
  tweenRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min)
  }
}

export default {
  install(Vue) {
    Vue.prototype.$utils = {
      dateUtils,
      commonUtils,
      htmlUtils,
      fileUtils,
      envUtils
    }
  }
}