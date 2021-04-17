const origin = window.location.origin
const logoPath = '/production-manager/favicon.ico'

const logoUrl = origin + logoPath

// 打印logo
console.log('%c', `padding: 20px 60px;background:url('${logoUrl}') no-repeat;`)
console.log('%c Cat You Manager Release', 'margin-left: 10px;padding-right: 5px;font-size: 20px;color: #fff;background-image: linear-gradient(to right, #e92758, #ff9569);')
