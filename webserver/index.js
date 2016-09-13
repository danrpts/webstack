var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var csurf = require('csurf');
var path = require('path');
var glob = require('glob');
var server = require('./singletons/express_singleton.js');

// Configure express
server.disable('x-powered-by');
server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended : false }));
server.use(cookieParser('serverles'));

// CSRF middleware enforcement
// server.use(csurf({
//   cookie: {
//     key: 'token',
//     httpOnly: true,
//     signed: true
//   }
// }));

// View engine setup
server.set('views', path.join(__dirname, 'public'));
server.set('view engine', 'ejs');

// Serve static files
server.use(express.static(path.join(__dirname, 'public')));

// Search directory for routes
var search = path.join(__dirname, 'routes');

// Load all routes synchronously
var routes = glob.sync('**/*.js', { cwd: search });
routes.forEach(function (found) {

  // serverend '/' character; takes care of '.'
  var filename = path.join('/', found);

  // Extract the uri prefix
  var prefix = path.dirname(filename);

  // Create the file path
  var absolute = path.join(search, filename);

  // Mount the endpoint
  server.use(prefix, require(absolute));

});

// TODO: Catch all other routes
// server.use(function (req, res, next) {
//   var err = new Error('Add information here...');
//   err.code = 404;
//   return next(err);
// });

// Error handlers

// Check for mutated csrf token and set forbidden
server.use(function (err, req, res, next) {
  if (err.code === 'EBADCSRFTOKEN') err.code = 403;
  return next(err);
});

// Handle all http errors
server.use(function (err, req, res, next) {
  var code = err.code || 500;
  var lookup = require('./config/errors_config.json');
  var dev = (server.get('env') === 'development');
  if (res.headersSent) return next(err);
  res.status(code);
  res.render('error', { 
    code: code,
    message: lookup[code],
    error: dev ? err : undefined
  });
});

module.exports = server;
