'use strict';

var _ = require('underscore');

var View = require('../classes/View.js');

var account_link_controller = require('../controllers/account_link_controller.js');
var task_list_controller = require('../controllers/task_list_controller.js');
var task_card_controller = require('../controllers/task_card_controller.js');

module.exports = View.extend({

  template: require('../../templates/scroll_header_transparent_template.html'),

  insertList: function () {
    var task_list_view = task_list_controller();
    this.insert(task_list_view, '[data-region="content"]');
  },

  insertCard: function (id) {
    var task_card_view = task_card_controller(id);
    this.insert(task_card_view, '[data-region="content"]');
  },

  postrender: function (options) {
    var account_link_view = account_link_controller();
    this.append(account_link_view, '[data-region="header"]');
    componentHandler.upgradeElements(this.el);
  }

});
