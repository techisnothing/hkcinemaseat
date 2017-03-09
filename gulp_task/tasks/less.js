const gulp = require('gulp');
const less = require('gulp-less');
const livereload = require('gulp-livereload');
const config  = require('../config.json');

const desire_path = config.css;

gulp.task('less',function(){
	return gulp.src(desire_path.src)
			.pipe(less())
			.pipe(gulp.dest(desire_path.dest))
			.pipe(livereload());
});
