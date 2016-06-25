'use strict';

var $ = require('jquery');
var _ = require('underscore');
var AccountModel = require('./Account_Model.js');
var config = require('../config/google_config.json');

module.exports = AccountModel.extend({

  setGoogleUser: function (user) {

    if (user.isSignedIn()) {

      var profile = user.getBasicProfile();
    
      this.set({
        'id': profile.getId(),
        'name': profile.getName(),
        'image_url': profile.getImageUrl(),
        'email': profile.getEmail(),
        'provider': 'Google'
      });

    }

    else this.clear();

  },

  initialize: function () {

    // Bind the signin/signout handler
    var setOrClear = _.bind(this.setGoogleUser, this);

    // Load the auth2 api
    gapi.load('auth2', function () {

      // Initiate new 'auth client'
      gapi.auth2
      .init({ 
        'client_id': config.client_id 
      });

      // Listen and set the user attributes
      gapi.auth2
      .getAuthInstance()
      .currentUser.listen(setOrClear);

    });

  },

  signIn: function (callback) {

    var context = this;

    console.log('Signing into Google...');

    gapi.auth2
    .getAuthInstance()
    .signIn()
    .then(function (user) {

      console.log('...signed in.');

      _.isFunction(callback)
        && callback.call(context, user);

    });

  },

  signOut: function (callback) {

    var context = this;

    console.log('Signing out of Google...');

    gapi.auth2
    .getAuthInstance()
    .signOut()
    .then(function () {

      console.log('...signed out.');

      _.isFunction(callback)
        && callback.call(context);

    });

  },

  grantOfflineAccess: function (callback) {

    var context = this;

    console.log('Fully signing in...');

    gapi.auth2
    .getAuthInstance()
    .grantOfflineAccess({  // Grant the one-time code
      'redirect_uri': config.redirect_uri
    })
    .then(function (response) {

      console.log('...functionality not available.');

      context.set('token', response.code);

      // TODO: Post to server

      _.isFunction(callback)
        && callback.call(context);

    });

  }

});
