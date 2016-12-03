'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/account_page.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  defaultViews: {
    'header': 'accountBar',
    'main': 'accountCard',
    'footer': 'accountActions'
  },

  accountBar: function () {
    var AccountBar = require('./Account_Bar.js');
    return new AccountBar({ model: this.model });
  },

  accountCard: function () {
    var AccountCard = require('./Account_Card.js');
    return new AccountCard({ model: this.model });
  },

  accountActions: function () {
    var AccountActions = require('./Account_Actions.js');
    return new AccountActions({ model: this.model });
  }

});
