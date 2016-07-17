'use strict';

var _ = require('underscore');

var View = require('../classes/View.js');

var account_link_handler = require('../handlers/account_link_handler.js');
var task_list_handler = require('../handlers/task_list_handler.js');
var task_card_handler = require('../handlers/task_card_handler.js');

module.exports = View.extend({

  template: require('../../templates/scroll_header_transparent_template.html'),

  defaultViews: {
    '[data-region="header"]': account_link_handler
  },

  setTaskListView: function () {

    var task_list_view = task_list_handler();

    this.setViews(task_list_view, '[data-region="content"]');

  },

  setTaskCardView: function (id) {

    var task_card_view = task_card_handler(id);

    this.setViews(task_card_view, '[data-region="content"]');

  },

  postrender: function () {

    componentHandler.upgradeElements(this.el);
  
  }

});
