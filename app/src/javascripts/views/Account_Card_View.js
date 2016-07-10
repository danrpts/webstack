'use strict';

var $ = require('jquery');
var _ = require('underscore');
var View = require('../classes/View.js');
var account = require('../singletons/account_singleton.js');
var codes = require('../config/keycodes_config.json');

module.exports = View.extend({

  template: require('../../templates/account_card_template.html'),

  events: {
    'mouseup #transitionBack': 'transitionBack',
    'mouseup #transitionHome': 'transitionHome',
    'mouseup #grantOfflineAccess': 'grantOfflineAccess',
    'mouseup #signOut': 'signOut',
    'keyup #inputGreeting': 'onEnter'

  },
  
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  transitionBack: function () {
    window.application.back();
  },

  transitionHome: function () {
    window.application.transition('');
  },

  grantOfflineAccess: function () {
    account.grantOfflineAccess();
  },

  signOut: function () {
    account.signOut(this.transitionHome);
  },

  onEnter: function (event) {
    if (event.which === codes['ENTER']) {
      this.updateGreeting($(event.target));
    }
  },

  updateGreeting: function ($input) {
    this.model.set({ greeting: $input.val().trim() });
    $input.val('').blur();
  },

  postrender: function (options) {
    options.animate && this.$el.hide().fadeIn();
    componentHandler.upgradeElements(this.el);
  }
  
});
