var gulp = require('gulp'),
	less = require('gulp-less');

gulp.task('less', function(){
	return gulp.src(['public/stylesheets/less/app.less'])
				.pipe(less())
				.pipe(gulp.dest('public/stylesheets'));
});

gulp.task('wless', ['less'], function(){
	gulp.watch('public/stylesheets/less/**', ['less']);
});
