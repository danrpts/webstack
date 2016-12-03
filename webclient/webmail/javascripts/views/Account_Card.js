'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/account_card.html'),

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  events: {
    'click #account-grant':   'onGrantClick',
    'click #account-signout': 'onSignoutClick',
  },

  onGrantClick: function () {
    this.model.grantOfflineAccess();
  },

  onSignoutClick: function () {
    var transition = _.partial(window.transition.to, 'login');
    this.model.signOut().done(transition);
  }
  
});
