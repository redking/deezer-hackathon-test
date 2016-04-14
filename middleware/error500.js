/*jshint -W098*/
'use strict';

/**
 * Handles server errors in production.
 *
 * NOTE that the returned function *must* have the four arguments err, req, res, next, in that order.
 *
 * @param app
 * @returns {error}
 */
module.exports = function (app) {

  return function error(err, req, res, next) {

    // Setup the error code correctly
    if (res.statusCode === 403) {
      err.status = 403;
    } else {
      err.status = (typeof err.status !== 'number') ? 500 : err.status;
    }

    // Make sure that the error has default values
    err.message = err.message || 'Internal server error';
    err.code = err.code || 'INTERNAL_ERROR';

    // Log the stack trace
    console.error(err.message);

    res.status(err.status);

    // Intercept xhr requests immediately, in case headers are
    // not properly set
    if (req.xhr) {
      res.send(err.status);
      return;
    }

    // Respond to HTML requests
    if (req.accepts('html')) {
      return res.render('errors/500', {
        title: '500 Error'
      });
    }

    // Respond to JSON requests
    if (req.accepts('json')) {
      res.send();
      return;
    }
    // Default to text/plain
    res.type('txt').send('500 Error');
  };
};