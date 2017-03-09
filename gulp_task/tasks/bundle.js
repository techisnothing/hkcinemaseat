const gulp = require('gulp');
const webpack = require('webpack-stream');
const livereload = require('gulp-livereload');
const named = require('vinyl-named');

const config = require('../config.json');
const webpack_config = require('../webpack.config.js');


gulp.task('bundle',function(){
	return gulp.src(config.js.src)
		.pipe(named())
		.pipe(webpack(webpack_config))
		.pipe(gulp.dest(config.js.dest))
		.pipe(livereload());
});
