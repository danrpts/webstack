'use strict';

var $ = require('jquery');
var backbone = require('backbone');
backbone.LocalStorage = require('backbone.localstorage');
var TransitionRouter = require('./routers/Transition_Router.js');

$(function() {

  window.transition = new TransitionRouter();

  // TODO:
  // Using { pushState: true } requires thought-out server
  backbone.history.start(); 

});
