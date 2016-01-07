'use strict';
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');
var Basic = require('./layouts/basic_Layout.js');

$(function() {

  // Initiate the account module
  //account.start();

  // Initiate the tasks module
  var b = new Basic().swap();
  require('./layouts/todo_layout_controller.js').start(b);

  // TODO: { pushState: true } requires thought out server mods
  Backbone.history.start(); 

});
