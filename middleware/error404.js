/*jshint -W098*/
'use strict';

/**
 * Handle 404 errors
 *
 * @returns {error404}
 */
module.exports = function () {

  return function error404(req, res, next) {

    res.status(404);

    // Intercept xhr requests immediately, in case headers are
    // not properly set
    if (req.xhr) {
      res.send();
      return;
    }

    // Respond to HTML requests
    if (req.accepts('html')) {
      res.render('errors/404', {
        title: '404 Error'
      });
      return;
    }

    // Respond to JSON requests
    if (req.accepts('json')) {
      res.send();
      return;
    }

    // default to text/plain
    res.type('txt').send('404 Error');
  };
};
