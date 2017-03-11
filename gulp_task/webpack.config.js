/*global __dirname*/
const webpack = require('webpack');
const path = require('path');

module.exports = {
	root: [
		path.join(__dirname, '../node_modules'),
		path.join(__dirname,'../src/js/')
	],
	context: path.join(__dirname,'../src/js/'),
	externals:{
		'jQuery':'$',
		'underscore':'_'
	},
	module:{
		loaders:[
			{
				test:/\.jsx?$/,
				loader:'babel',
				query:{
					presets:['es2015','stage-2']
				}
			},
			{
				test:/\.html$/,
				loader: 'html-loader',
				options: {
					minimize: true
				}
			}
		],
	},
	resolve:{
		extension: ['', '.js'],
		alias:{
			vue: 'vue/dist/vue.js'
		}
	},
	plugins:[
		new webpack.optimize.DedupePlugin(),
		// new webpack.optimize.UglifyJsPlugin()
	],
	resolveLoader: {
		modulesDirectories: [
			path.join(__dirname,'../node_modules')
		]
	},
};
