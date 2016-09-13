'use strict';

var $ = require('jquery');

var _ = require('underscore');

var Model = require('../../../architecture/classes/Model.js');

var config = require('../config/google.json');

var gAuth = require('../services/gAuth.js');

module.exports = Model.extend({

  defaults: {
    'id': undefined,
    'name': undefined,
    'image_url': undefined,
    'email': undefined,
    'provider': undefined,
    'signed_in': false,
    'fully_signed_in': false,
    'provider': 'Google'
  },

  clear : function (options) {
    this.promise = $.Deferred();
    Model.prototype.clear.call(this, options);
  },

  isSignedIn: function () {
    return !! this.get('signed_in');
  },

  isFullySignedIn: function () {
    return !! this.get('fully_signed_in');
  },

  getImageUrl: function () {
    return this.get('image_url'); 
  },

  setUserAttributes: function (user) {

    this.set(this.defaults, { silent: true });

    if (user.isSignedIn()) {

      var profile = user.getBasicProfile();
    
      this.set({
        'id': profile.getId(),
        'name': profile.getName(),
        'image_url': profile.getImageUrl(),
        'email': profile.getEmail(),
        'signed_in': true
      });

      var auth = user.getAuthResponse();

      this.set({ 'token': auth.access_token });

    }

  },

  signIn: function () {

    var model = this;

    var promise = $.Deferred();

    //console.log('Signing into Google...');

    gAuth.

    done(function (service) {

      service.
      
      signIn().
      
      then(function (user) {

        //console.log('...signed in.');

        promise.resolve();

        model.setUserAttributes(user);

      });

    });

    return promise;

  },

  signOut: function () {

    var model = this;

    var promise = $.Deferred();

    //console.log('Signing out of Google...');

    gAuth.

    done(function (service) {

      service.
    
      signOut().

      then(function () {

        //console.log('...signed out.');

        promise.resolve();

        model.clear();

      });

    });

    return promise;

  },

  grantOfflineAccess: function () {

    var model = this;

    //console.log('Fully signing in...');

    return gAuth.

    done(function (service) {

      service.
    
      grantOfflineAccess({  // Grant the one-time code
        'redirect_uri': config.redirect_uri
      }).
      
      then(function (response) {

        console.log('... functionality not yet available.');

        // model.set('token', response.code);

        // TODO: Post to server

      });

    });

    return this;

  },

  fetch: function (options) {

    // TODO: Explore errors and return values

    var model = this;

    this.promise = this.promise
      && this.promise.state() === 'pending'
      ? this.promise
      : $.Deferred();

    this.trigger('request', this.promise, options);

    gAuth.
    
    done(function (service) {
    
      var user = service.currentUser.get();
    
      model.setUserAttributes(user);
    
      model.promise.resolve(user);
    
      model.trigger('sync', model, user);
    
    });

    return this.promise;

  }

});
