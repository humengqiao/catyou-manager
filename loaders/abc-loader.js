const loaderUtils = require('loader-utils')

module.exports = function(content) {
	const value = content.trim()

	const loaderContext = this
	const { resourcePath, resourceQuery } = loaderContext
	const templateRequest = loaderUtils.stringifyRequest(loaderContext, resourcePath + resourceQuery)

	console.log(templateRequest)

	return `
		import xx from ${loaderUtils.stringifyRequest(loaderContext, '!' + require.resolve('../src/utils/index.js'))}

		module.hot.accept(${templateRequest}, () => {
			console.log('hot reload')
		})

		export default Component => {
			Component.options._abc = "${value}"
			document.body.append("${value}")
		}
	`
}
