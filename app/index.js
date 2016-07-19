var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var csurf = require('csurf');
var path = require('path');
var glob = require('glob');
var app = require('./singletons/app_singleton.js');

// Configure express
app.disable('x-powered-by');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(cookieParser('apples'));

// CSRF middleware enforcement
// app.use(csurf({
//   cookie: {
//     key: 'token',
//     httpOnly: true,
//     signed: true
//   }
// }));

// View engine setup
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Search directory for routes
var search = path.join(__dirname, 'routes');

// Load all routes synchronously
var routes = glob.sync('**/*.js', { cwd: search });
routes.forEach(function (found) {

  // Append '/' character; takes care of '.'
  var filename = path.join('/', found);

  // Extract the uri prefix
  var prefix = path.dirname(filename);

  // Create the file path
  var absolute = path.join(search, filename);

  // Mount the endpoint
  app.use(prefix, require(absolute));

});

// TODO: Catch all other routes
// app.use(function (req, res, next) {
//   var err = new Error('Add information here...');
//   err.code = 404;
//   return next(err);
// });

// Error handlers

// Check for mutated csrf token and set forbidden
app.use(function (err, req, res, next) {
  if (err.code === 'EBADCSRFTOKEN') err.code = 403;
  return next(err);
});

// Handle all http errors
app.use(function (err, req, res, next) {
  var code = err.code || 500;
  var lookup = require('./config/errors_config.json');
  var dev = (app.get('env') === 'development');
  if (res.headersSent) return next(err);
  res.status(code);
  res.render('error', { 
    code: code,
    message: lookup[code],
    error: dev ? err : undefined
  });
});

module.exports = app;
