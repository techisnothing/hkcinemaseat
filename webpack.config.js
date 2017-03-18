/*global __dirname*/
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	context: path.join(__dirname, './src'),
	devtool: 'inline-source-map',
	entry:{
		index: ['./index.js', 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'],
		details: ['./details.js', 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true']
	},
	output:{
		path: path.resolve(__dirname, './dist'),
		filename: 'js/[name].js'
	},
	module:{
		rules:[
			{
				test:/\.js$/,
				use:[{
					loader:'babel-loader',
					options:{
						presets:['es2015','stage-2']
					}
				}]
			},
			{
				test:/\.html$/,
				use: [{
					loader: 'html-loader',
					options: {
						minimize: true
					}
				}]
			},
			{
				test:/\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader'
				})
			}
		],
	},
	resolve:{
		modules: [path.resolve(__dirname, './src/js'), 'node_modules'],
		extensions: ['.js', '.html', '.css'],
		alias:{
			vue: 'vue/dist/vue.js'
		}
	},
	plugins:[
		new ExtractTextPlugin({
			filename: 'css/[name].css',
			allChunks: true,
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
		// new webpack.optimize.UglifyJsPlugin()
	]
};
