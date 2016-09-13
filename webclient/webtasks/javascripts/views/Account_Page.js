'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/account_page.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  defaultViews: {
    'main': 'accountCard'
  },

  accountCard: function () {
    var AccountCard = require('./Account_Card.js');
    return new AccountCard({ model: this.model });
  }

});
