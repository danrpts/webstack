'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/login_page.html'),

  defaultViews: {
    'main': 'loginCard'
  },

  loginCard: function () {
    var LoginCard = require('./Login_Card.js');
    return new LoginCard({ model: this.model });
  }

});