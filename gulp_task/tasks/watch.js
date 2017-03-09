const gulp = require('gulp');
const livereload = require('gulp-livereload');
const config  = require('../config.json');

gulp.task('watch', function() {
	livereload.listen();
	gulp.watch(config.css.folder, ['less']);
	gulp.watch(config.js.folder, ['bundle']);
});
