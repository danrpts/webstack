'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/login_page.html'),

  prerender: function () {},

  postrender: function () {},

  defaultViews: {
    'main': 'loginCard'
  },

  loginCard: function () {
    var LoginCard = require('./Login_Card.js');
    return new LoginCard({ model: this.model });
  },

  shareCard: function () {
    var ShareCard = require('./Share_Card.js');
    return new ShareCard();
  },

  events: {
    'click #login-share': 'onShareClick',
    'click #share-back': 'onBackClick'
  },

  onShareClick: function () {
    this.setView(this.shareCard(), 'main');
  },

  onBackClick: function () {
    this.setView(this.loginCard(), 'main');
  }

});