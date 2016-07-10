'use strict';

var $ = require('jquery');
var backbone = require('backbone');
backbone.LocalStorage = require('backbone.localstorage');
var ApplicationRouter = require('./routers/Application_Router.js');

$(function() {

  window.application = new ApplicationRouter();

  // TODO:
  // Using { pushState: true } requires thought-out server
  backbone.history.start(); 

});
