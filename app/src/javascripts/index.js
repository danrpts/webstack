'use strict';
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');
var tasksController = require('./controllers/tasks_controller.js');

var Router = Backbone.Router.extend({

  routes: {
    '': tasksController.showListView,
    'tasks/:id': tasksController.showCardView
  },

  initialize: function () {
    this.listenTo(Backbone, 'router:goto', this.goto);
  },

  goto: function (fragment) {
    this.navigate(fragment, {trigger: true});
  }

});

$(function() {

  new Router();

  Backbone.history.start(); //{pushState: true} TODO server mods

});
