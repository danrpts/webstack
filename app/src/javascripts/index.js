'use strict';
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');
var Tasks = require('./routers/tasks_Router.js');

$(function() {

  new Tasks();

  // TODO: {pushState: true} requires thought out server mods
  Backbone.history.start(); 

});
