'use strict';

var View = require('../classes/View.js');
var google = require('../helpers/google_helpers.js');

module.exports = View.extend({

  template: require('../../templates/account_link_template.html'),

  events: {
    'mouseup .signin': 'signin',
    'mouseup .profile': 'profile'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  signin: function () {
    google.signIn();
  },

  profile: function () {
    window.transition.to('account/' + this.model.id);
  }

});
