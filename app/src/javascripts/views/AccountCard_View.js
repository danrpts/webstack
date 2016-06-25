'use strict';

var View = require('../classes/View.js');
var account = require('../singletons/account_singleton.js');

module.exports = View.extend({

  template: require('../../templates/account_card_template.html'),

  events: {
    'mouseup #transitionBack': 'transitionBack',
    'mouseup #transitionHome': 'transitionHome',
    'mouseup #grantOfflineAccess': 'grantOfflineAccess',
    'mouseup #signOut': 'signOut'
  },
  
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  transitionBack: function () {
     window.transition.back();
  },

  transitionHome: function () {
     window.transition.to('');
  },

  grantOfflineAccess: function () {
    account.grantOfflineAccess();
  },

  signOut: function () {
    account.signOut(this.transitionHome);
  },

  render: function () {
    return View.prototype.render.call(this, function () {
      this.$el.hide().fadeIn();
    });
  }
  
});
