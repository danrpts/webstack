'use strict';

var _ = require('underscore');

var View = require('../classes/View.js');

var account_link_controller = require('../controllers/account_link_controller.js');
var account_card_controller = require('../controllers/account_card_controller.js');

module.exports = View.extend({

  template: require('../../templates/scroll_header_transparent_template.html'),

  insertCard: function () {
    var account_card_view = account_card_controller();
    this.insert(account_card_view, '[data-region="content"]');
  },

  postrender: function (options) {
    var account_link_view = account_link_controller();
    this.append(account_link_view, '[data-region="header"]');
    componentHandler.upgradeElements(this.el);
  }

});
