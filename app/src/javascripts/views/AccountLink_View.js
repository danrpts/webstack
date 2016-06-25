'use strict';

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
    window.transition.to('account/' + this.model.id);
  },

  signIn: function () {
    account.signIn();
  }

});
