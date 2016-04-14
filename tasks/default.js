'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('default', function(next) {
	runSequence('setWatch', 'build', ['watch', 'nodemon'], next);
});

gulp.task('build', function(next) {
	runSequence('clean', ['css', 'browserify', 'resources'], next);
});