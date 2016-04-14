'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var handleErrors = require('./util/handleErrors');

gulp.task('css', function() {
	return gulp.src('src/less/*.less')
		.on('error', handleErrors)
		.pipe(less())
		.pipe(gulp.dest('./public/css'));
});
