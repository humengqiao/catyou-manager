const path = require('path')
const feedUrl = require('./src/config/app-update').feedUrl

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@views', resolve('src/views'))
      .set('@components', resolve('src/components'))
      .set('@styles', resolve('src/assets/styles'))
      .set('@config', resolve('src/config'))
      .set('@services', resolve('src/services'))
      .set('@utils', resolve('src/utils'))
      .set('@store', resolve('src/store'))
      .set('@themes', resolve('src/themes'))
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        'appId': 'com.humengqiao.app',
        'productName': '产品进销存管理系统',//项目名，也是生成的安装文件名
        'copyright': 'Copyright © 2020',//版权信息
        'publish': [
          {
            'provider': 'generic',
            'url': feedUrl,
            'updaterCacheDirName': 'production-manager-updater'
          }
        ],
        'mac': { // mac相关配置
          // 'icon': './public/favicon.ico',//图标，当前图标在根目录下，注意这里有两个坑
          'target': ['dmg', 'zip'],
          'extendInfo': {
            'URL types': [
              {
                'URL identifier': 'production-manager',
                'URL Schemes': [
                  'production-manager'
                ]
              }
            ]
          }
        },
        'dmg': {
          'title': '产品进销存管理系统',
          // 'icon': './public/favicon.ico',
          'contents': [
            {
              'x': 110,
              'y': 150
            },
            {
              'x': 240,
              'y': 150,
              'type': 'link',
              'path': '/Applications'
            }
          ],
          'window': {
            'x': 400,
            'y': 400
          }
        },
        'win': { //win相关配置
          'icon': './public/favicon.ico',//图标，当前图标在根目录下，注意这里有两个坑
          'target': [
            {
              'target': 'nsis', //利用nsis制作安装程序
              'arch': [
                'x64' //64位
              ]
            }
          ]
        }
      }
    }
  }
}
