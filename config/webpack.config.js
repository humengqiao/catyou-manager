const webpack = require('webpack')
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MinicssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

console.log(path.join(__dirname, '../src/'))

const webpackConfig = [
	{
		mode: 'production',
		entry: path.resolve(__dirname, '../src/test.js'),
		output: {
			path: path.resolve(__dirname, '../dist-lib'),
			filename: '[name].[chunkhash].cjs.js',
			libraryTarget: 'commonjs2',
			library: 'test'
		},
		optimization: {
			minimize: true
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					use: 'vue-loader',
					exclude: /node_modules/
				},
				{
					test: /\.styl(us)?$/,
					use: [MinicssExtractPlugin.loader, {
						loader: 'css-loader',
						options: {
							esModule: true
						}
					}, 'stylus-loader'],
					exclude: /node_modules/
				}
			]
		},
		resolve: {
			alias: {
				'@': path.join(__dirname, '../src/')
			},
			extensions: [
				'.vue',
				'.js',
				'.json'
			]
		},
		plugins: [
			new VueLoaderPlugin(),
			new MinicssExtractPlugin({filename: "[name].cjs.css",chunkFilename: "[id].cjs.css"}),
			new OptimizeCSSAssetsPlugin({
				assetNameRegExp: /main\.[0-9a-zA-Z]+\.css/g,  //需要根据自己打包出来的文件名来写正则匹配这个配置是我自己的
				cssProcessor: require('cssnano'),
				cssProcessorOptions: {
					discardComments: { removeAll: true },
					parser: require('postcss-safe-parser'),
					autoprefixer: false
				},
				canPrint: true
			})
		],
		node: {
			fs: 'empty'
		}
	},
	{
		mode: 'production',
		entry: path.resolve(__dirname, '../src/test.js'),
		output: {
			path: path.resolve(__dirname, '../dist-lib'),
			filename: '[name].[chunkhash].umd.js',
			libraryTarget: 'umd',
			library: 'test',
			libraryExport: 'default'
		},
		optimization: {
			minimize: true
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					use: 'vue-loader'
				},
				{
					test: /\.styl(us)?$/,
					use: [MinicssExtractPlugin.loader, {
						loader: 'css-loader',
						options: {
							esModule: true
						}
					}, 'stylus-loader']
				}
			]
		},
		resolve: {
			alias: {
				'@': path.join(__dirname, '../src/')
			},
			extensions: [
				'.vue',
				'.js',
				'.json'
			]
		},
		plugins: [
			new VueLoaderPlugin(),
			new MinicssExtractPlugin({filename: "[name].umd.css",chunkFilename: "[id].umd.css"}),
			new OptimizeCSSAssetsPlugin({
				assetNameRegExp: /main\.[0-9a-zA-Z]+\.css/g,  //需要根据自己打包出来的文件名来写正则匹配这个配置是我自己的
				cssProcessor: require('cssnano'),
				cssProcessorOptions: {
					discardComments: { removeAll: true },
					parser: require('postcss-safe-parser'),
					autoprefixer: false
				},
				canPrint: true
			})
		],
		node: {
			fs: 'empty'
		}
	}
]

module.exports = webpackConfig

// webpack(webpackConfig, (error, stats) => {
// 	console.log(error, stats)
// })
