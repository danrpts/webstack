'use strict';

var $ = require('jquery');

var _ = require('underscore');

var config = require('../config/google.json');

var deferred = $.Deferred();

if (deferred.state() != 'resolved') {
  
  gapi.

  load('auth2', function () {

    gapi.auth2.

    init({ 
      'client_id': config.client_id,
      'scope': config.scope
    }).

    then(deferred.resolve);

  });

}

module.exports = deferred;
