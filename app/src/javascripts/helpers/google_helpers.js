var $ = require('jquery');
var Backbone = require('backbone');
var google = require('../config/google_config.json');

module.exports = {

  client: function () {
    return gapi.auth2.getAuthInstance();
  },

  user: function () {
    return this.client().currentUser.get();
  },

  profile: function () {
    return this.user().getBasicProfile();
  },

  connect: function () {

    // First wrap Google's promise with our own
    var that = this;
    var client = $.Deferred();

    // If auth2 api has been loaded
    if ('auth2' in gapi) {

      // Then retreive the existing 'auth client'
      var existing = this.client();

      // Bind the context and resolve
      client.resolveWith(that, [existing]);
    
    }

    // Otherwise, initialize
    else {

      // Load the auth2 api with Google's promise
      gapi.load('auth2', function () {

        // Then initiate a new 'auth client' with Google
        var initiated = gapi.auth2.init({ 'client_id': google.client_id });

        // Integrate Google's event system with Backbone
        initiated.isSignedIn.listen(function (status) {
          Backbone.trigger('google:isSignedIn', status);
        });

        initiated.currentUser.listen(function (user) {
          Backbone.trigger('google:currentUser', user);
        });

        // Bind the context and resolve
        client.resolveWith(that, [initiated]);

      });

    }

    // Return as jQuery promise
    return client.promise();

  },

  signIn: function () {

    // First wrap Google's promise with our own
    var that = this;
    var response = $.Deferred();
    var client = this.client();

    // Invoke sign-in window
    client.signIn().then(function (user) {

      // Bind the context and resolve the code 
      response.resolveWith(that, [user]);

    });

    // Return ad jQuery promise
    return response.promise();

  },

  signOut: function () {

    // First wrap Google's promise with our own
    var that = this;
    var response = $.Deferred();
    var client = this.client();

    // Sign use out
    client.signOut().then(function () {

      // Bind the context and resolve the code 
      response.resolveWith(that);

    });

    // Return ad jQuery promise
    return response.promise();

  },

  grantOfflineAccess: function () {

    // First wrap Google's promise with our own
    var that = this;
    var response = $.Deferred();
    var client = this.client();

    // Grant the one-time code
    client.grantOfflineAccess({ 'redirect_uri': google.redirect_uri }).then(function (authCode) {

      // Bind the context and resolve the code 
      response.resolveWith(that, [authCode]);

    });

    // Return ad jQuery promise
    return response.promise();

  },

  postToServer: function (authCode) {

    console.log(authCode);

    // First wrap Google's promise with our own
    var that = this;
    var response = $.Deferred();
    var client = this.client();

    // Grant the one-time code
    $.ajax({
      type: 'POST',
      url: '/api/account',
      contentType: 'application/json',
      data: JSON.stringify(authCode),
      dataType: 'json',
      processData: false,
      success: function (data, status, xhr) {
        Backbone.trigger('google:isFullySignedIn', true);
        response.resolveWith(that, [data]);
      }
    });

    // Return ad jQuery promise
    return response.promise();

  }

}
