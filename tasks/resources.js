'use strict';

var gulp = require('gulp');
var handleErrors = require('./util/handleErrors');

gulp.task('resources', function() {
	return gulp.src('./node_modules/datamaps/dist/datamaps.world.min.js')
		.on('error', handleErrors)
		.pipe(gulp.dest('./public/js'));

});
