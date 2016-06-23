'use strict';

var View = require('../classes/View.js');
var google = require('../helpers/google_helpers.js');

module.exports = View.extend({

  template: require('../../templates/account_card_template.html'),

  events: {
    'mouseup .back': 'back',
    'mouseup .home': 'home',
    'mouseup .forward': 'forward',
    'mouseup .grant': 'grant',
    'mouseup .signout': 'signout'
  },
  
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  back: function () {
     window.transition.back();
  },

  home: function () {
     window.transition.to('');
  },

  forward: function () {
     window.transition.forward();
  },

  grant: function () {
    google.grantOfflineAccess().then(google.postToServer);
  },

  signout: function () {
    google.signOut().then(transition.back);
  },

  render: function () {
    return View.prototype.render.call(this, function () {
      this.$el.hide().fadeIn();
    });
  }
  
});
