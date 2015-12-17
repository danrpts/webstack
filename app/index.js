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

/* Configure a Google Passport */
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
app.use(passport.initialize());
passport.use(new GoogleStrategy({
    clientID: "980383434827-m165b51rpsk2o2tlc5c6efgr3iepf0mr.apps.googleusercontent.com",
    clientSecret: "EWgOFPh1-I7278chZ30tzj3W",
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));
/**/

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
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.session());
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
