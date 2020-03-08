import preview from './preview'

const directives = [
  preview
]

export default {
  install(Vue) {
    directives.forEach(item => {
      if(item && typeof item === 'function') {
        item(Vue)
      }
    })
  }
}