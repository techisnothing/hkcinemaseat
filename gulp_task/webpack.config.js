/*global __dirname*/
const webpack = require('webpack');
const path = require('path');

module.exports = {
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
			}
		],
	},
	resolve:{
		extension: ['', '.js']
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
