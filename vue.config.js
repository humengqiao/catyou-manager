const path = require('path')
const feedUrl = require('./src/config/app-update').feedUrl
const RuleSet = require('webpack/lib/RuleSet')

const resolve = dir => {
  return path.join(__dirname, dir)
}

class TestPlugin {
	apply(compiler) {
		compiler.hooks.compilation.tap('testPlugin', compilation => {
			const rawRules = compiler.options.module.rules
			const { rules } = new RuleSet(rawRules)
			const createMatcher = (fakeFile) => {
				return (rule, i) => {
					// #1201 we need to skip the `include` check when locating the vue rule
					const clone = Object.assign({}, rule)
					delete clone.include
					const normalized = RuleSet.normalizeRule(clone, {}, '')
					console.log(normalized)
					return (
						!rule.enforce &&
						normalized.resource &&
						normalized.resource(fakeFile)
					)
				}
			}

			let vueRuleIndex = rawRules.findIndex(createMatcher(`foo.vue`))
			console.log(vueRuleIndex)
			if (vueRuleIndex < 0) {
				vueRuleIndex = rawRules.findIndex(createMatcher(`foo.vue.html`))
			}
			const vueRule = rules[vueRuleIndex]
			console.log(vueRule)
		})
	}
}

module.exports = {
  publicPath: process.env.VUE_APP_BUILD_TARGET === 'gh-pages' ? '/production-manager/' : '/',
	outputDir: process.env.VUE_APP_OUT_DIR ? process.env.VUE_APP_OUT_DIR : 'dist',
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

		config.plugins.delete('prefetch')
		config.plugins.delete('preload')

		// config
		// 	.module
		// 	.rule('abc')
		// 	.resourceQuery(/blockType=abc/)
		// 	.type('javascript/auto')
		// 	.use('abc')
		// 	.loader(require.resolve('./loaders/abc-loader.js'))

		// config
		// 	.plugin('testPlugin')
		// 	.use(TestPlugin)
	},
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        'appId': 'com.humengqiao.app',
        'productName': 'Cat You Manager',//项目名，也是生成的安装文件名
        'copyright': 'Copyright © 2021',//版权信息
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
          'title': 'Cat You Manager',
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
