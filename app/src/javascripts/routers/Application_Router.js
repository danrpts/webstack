'use strict';

var $ = require('jquery');

var Router = require('../classes/Router.js');

var task_page_controller = require('../controllers/task_page_controller.js');
var account_page_controller = require('../controllers/account_page_controller.js');

module.exports = Router.extend({

  active_view: undefined,

  routes: {
  
    '': 'index',

    'task/:id': 'task',
    
    'account/:id': 'account'
  
  },

  index: function () {

    var task_page_view = task_page_controller();

    this.active_view && this.active_view.remove();

    this.active_view = task_page_view;

    task_page_view.render().$el.appendTo($('[data-region="application"]'));

    task_page_view.insertList();

  },

  task: function (id) {

    var task_page_view = task_page_controller();

    this.active_view && this.active_view.remove();

    this.active_view = task_page_view;

    task_page_view.render().$el.appendTo($('[data-region="application"]'));

    task_page_view.insertCard(id);
    
  },

  account: function () {

    var account_page_view = account_page_controller();

    this.active_view && this.active_view.remove();

    this.active_view = account_page_view;

    account_page_view.render().$el.appendTo($('[data-region="application"]'));

    account_page_view.insertCard();
    
  }

});
