'use strict';

var $ = require('jquery');
var backbone = require('backbone');
var Model = require('../classes/Model.js');
var google = require('../helpers/google_helpers.js');

module.exports = Model.extend({

  defaults: {
    'name': null,
    'imageUrl': null,
    'email': null,
    'fullySignedIn': false
  },

  initialize: function () {

    console.log('Signing in...');

    // Initiate the Google OAuth2 API
    google.connect();

    // Listen for special Google events
    backbone.Events.listenTo.call(this, backbone, 'google:isSignedIn', this.toggle);
    backbone.Events.listenTo.call(this, backbone, 'google:isFullySignedIn', this.fully);

  },

  toggle: function (isSignedIn) {
    var profile;

    if (isSignedIn) {

      console.log('...signed in.');

      profile = google.profile();

      this.set({
        'id': profile.getId(),
        'name': profile.getName(),
        'imageUrl': profile.getImageUrl(),
        'email': profile.getEmail()
      });

    }

    else {
      console.log('...signed out.');
      this.clear();
    }

  },

  fully: function (status) {
    status && console.log('...fully signed in.');
    this.set({
      'fullySignedIn': status
    });
  },

  // temporary override
  promise: function () {
    return $.Deferred().resolveWith(this, [this.toJSON()]).promise();
  }

});
