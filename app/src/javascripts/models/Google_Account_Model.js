'use strict';

var $ = require('jquery');
var _ = require('underscore');
var AccountModel = require('./Account_Model.js');
var config = require('../config/google_config.json');

var googleAuthDeferred = $.Deferred();

module.exports = AccountModel.extend({

  initialize: function () {

    if (!_.has(gapi, 'auth2')) {

      // Load the auth2 api
      gapi.load('auth2', function () {

        // Initiate new 'auth client'
        gapi.auth2.

        init({ 
          'client_id': config.client_id 
        }).

        then(googleAuthDeferred.resolve);

      });

    }

  },

  setGoogleUser: function (user) {

    this.set(this.defaults, { silent: true });

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

  signIn: function (callback) {

    var model = this;

    console.log('Signing into Google...');

    googleAuthDeferred.

    done(function (googleAuth) {

      googleAuth.
      
      signIn().
      
      then(function (user) {

        console.log('...signed in.');

        model.setGoogleUser(user);

        _.isFunction(callback)
          && callback();

      });

    });

    return this;

  },

  signOut: function (callback) {

    var model = this;

    console.log('Signing out of Google...');

    googleAuthDeferred.

    done(function (googleAuth) {

      googleAuth.
    
      signOut().

      then(function () {

        console.log('...signed out.');

        _.isFunction(callback)
          && callback();

      });

    });

    return this;

  },

  grantOfflineAccess: function (callback) {

    var context = this;

    console.log('Fully signing in...');

    googleAuthDeferred.

    done(function (googleAuth) {

      googleAuth.
    
      grantOfflineAccess({  // Grant the one-time code
        'redirect_uri': config.redirect_uri
      }).
      
      then(function (response) {

        console.log('... functionality not yet available.');

        // context.set('token', response.code);

        // TODO: Post to server

      });

    });

    return this;

  },

  fetch: function (options) {

    // TODO: Explore errors and return values

    var model = this;

    this.promise = this.promise || $.Deferred();

    this.trigger('request', this.promise, options);

    googleAuthDeferred.
    done(function (googleAuth) {
      var user = googleAuth.currentUser.get();
      model.promise.
      resolveWith(model, user);
      model.setGoogleUser(user);
      model.trigger('sync', model, user);
    });

    return this.promise;

  }

});
