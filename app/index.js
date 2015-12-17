var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var glob = require('glob');
var passport = require('passport');
var app = express();

var helpers = require('./helpers/error_helpers.js');

// Load all routes synchronously
var routes = glob.sync('./routes/*.js', {cwd: path.join(process.cwd(), '/app')});
  routes.forEach(function (route) {
  require(route)(app);
});

// View engine setup
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.disable('x-powered-by');


// Catch all routes
app.get('*', function (req, res, next) {
  next(helpers.httpError(404));
});

// Error handler
app.use(helpers.logger);
app.use(helpers.basic);

module.exports = app;
