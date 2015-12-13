'use strict';
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');

$(function() {

  require('./controllers/tasks_controller.js');

  // TODO: {pushState: true} requires thought out server mods
  Backbone.history.start(); 

});
