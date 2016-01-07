var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Controller = require('../classes/Controller.js');
var google = require('../helpers/google_helpers.js');
var closure = require('../helpers/presenter_helpers.js');

module.exports = Controller.extend({

  events: {
    'mouseup .back': 'back',
    'mouseup .grant': 'grant',
    'mouseup .signout': 'signout'
  },

  template: require('../../templates/account_CardTemplate.html'),
  
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  back: function () {
    Backbone.trigger('goto:tasks', '');
  },

  grant: function () {
    var that = this;
    google.grantOfflineAccess().then(google.postToServer);
  },

  signout: function () {
    var that = this;
    google.signOut().then(function () {
      that.back(); 
    });
  }
  
});
