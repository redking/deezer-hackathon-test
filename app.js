'use strict';

var express = require('express');
var path = require('path');
var routes = require('./routes/index');
var isDebug = (process.env.NODE_ENV !== 'production');

// Middleware
var layout = require('./middleware/layout');
var error404 = require('./middleware/error404');
var error500 = require('./middleware/error500');

// maxage
var ONE_YEAR = 86400000 * 365;

// Setup app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Layout path
app.use(layout());

// Static and routes
app.use(express.static(path.join(__dirname, 'public'), { maxAge: (!isDebug) ? ONE_YEAR : null }));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(error404());

// error handlers
app.use(error500());

module.exports = app;
