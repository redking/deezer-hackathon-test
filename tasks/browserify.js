'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var handleErrors = require('./util/handleErrors');

gulp.task('browserify', function() {

  var appBundler = browserify({
    // Required watchify args
    cache: {}, packageCache: {}, fullPaths: true,
    // Specify the entry point of your app
    entries: ['./src/js/app.js'],
    // Add file extensions to make optional in your requires
    extensions: ['.js'],
    // Enable source maps!
    debug: true,
    transform: ['babelify', 'envify']
  });

  var rebundle = function() {
    var start = Date.now();
    console.log('Building app bundle ...');
    appBundler.bundle()
        .on('error', handleErrors)
        .pipe(source('app.js'))
        .pipe(gulp.dest('./public/js'))
        .on('end', function() {
          console.log('App bundle built in ' + (Date.now() - start) / 1000 + 's');
        });
  };

  if (global.isWatching) {
    var watchify = require('watchify');
    appBundler = watchify(appBundler);
    appBundler.on('update', rebundle);
  }

  rebundle();
});

gulp.task('setWatch', function() {
  global.isWatching = true;
});
