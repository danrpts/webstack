'use strict';

var _ = require('underscore');
var View = require('../classes/View.js');
var account = require('../singletons/account_singleton.js');

module.exports = View.extend({

  template: require('../../templates/account_link_template.html'),

  events: {
    'mouseup #transitionToAccount': 'transitionToAccount',
    'mouseup #signIn': 'signIn'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  transitionToAccount: function () {
    window.application.transition('account/' + this.model.id);
  },

  signIn: function () {
    account.signIn();
  },

  postrender: function (options) {
    options.animate && this.$el.hide().fadeIn();
    componentHandler.upgradeElements(this.el);
  }

});
