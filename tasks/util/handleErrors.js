'use strict';

module.exports = function() {

	var args = Array.prototype.slice.call(arguments);

	if (process.env.NODE_ENV !== 'production') {
		var notify = require('gulp-notify');
		// Send error to notification center with gulp-notify
		notify.onError({
			title: 'Compile Error',
			message: '<%= error.message %>'
		}).apply(this, args);
	} else {
		console.error('Compile Error', args);
	}

	// Keep gulp from hanging on this task
	this.emit('end');
};
