'use strict';
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');
var account = require('./controllers/account_controller.js');
var tasks = require('./controllers/tasks_controller.js');

$(function() {

  //account.start();
  tasks.start();

  // TODO: {pushState: true} requires thought out server mods
  Backbone.history.start(); 

});
