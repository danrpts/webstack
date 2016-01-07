var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Model = require('../classes/Model.js');
var config = require('../config/account_config.json');
var google = require('../helpers/google_helpers.js');

var AccountModel = Model.extend({

  defaults: {
    'name': null,
    'imageUrl': null,
    'email': null,
    'fullySignedIn': false
  },

  initialize: function () {

    // Initiate the Google OAuth2 API
    google.connect();

    // Listen for special Google events
    Backbone.Events.listenTo.call(this, Backbone, 'google:isSignedIn', this.toggle);
    Backbone.Events.listenTo.call(this, Backbone, 'google:isFullySignedIn', this.fully);

  },

  toggle: function (isSignedIn) {
    var profile;

    if (isSignedIn) {

      config.debug && console.log('Signing in...');

      profile = google.profile();

      this.set({
        'id': profile.getId(),
        'name': profile.getName(),
        'imageUrl': profile.getImageUrl(),
        'email': profile.getEmail()
      });

    }

    else {
      config.debug && console.log('Signing out...');
      this.clear();
    }

  },

  fully: function (status) {
    config.debug && status && console.log('Fully signing in...');
    this.set({
      'fullySignedIn': status
    });
  },

  // temporary override
  promise: function () {
    return $.Deferred().resolveWith(this, [this.toJSON()]).promise();
  }

});

module.exports = {

  Model: AccountModel

}
