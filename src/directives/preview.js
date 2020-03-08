import Vue from 'vue'
import { Message } from 'element-ui'
import Preview from '@components/preview'

const handleClick = function(binding) {
  return function() {
    const urls = binding.value
    
    if(urls.length === 0) {
      return Message({
        type: 'error',
        message: '无产品图片'
      })
    }

    const PreviewConstructor = Vue.extend(Preview)
    const component = new PreviewConstructor({
      propsData: {
        url: urls,
        visible: true
      }
    }).$mount()

    const $el = component.$el

    component.$on('close', () => {
      component.visible = false
    })

    document.body.appendChild($el)
  }
}

export default Vue => {
  Vue.directive('preview', {
    bind(el, binding) {
      el.addEventListener('click', handleClick(binding), false)
    },
    unbind(el) {
      el.removeEventListener('click', handleClick)
    }
  })
}