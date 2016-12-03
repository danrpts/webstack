'use strict';

var $ = require('jquery');

var _ = require('underscore');

var Collection = require('../../../architecture/classes/Collection.js');

var Radios = require('./Radios');

module.exports = Radios.extend({

  url: 'https://www.googleapis.com/gmail/v1/users/me/labels',

  fetch: function (options) {

    var account = require('../singletons/account.js');
    
    options = options || {};

    var beforeSend = options.beforeSend;
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      if (beforeSend) return beforeSend.apply(this, arguments);
    }
    
    return Collection.prototype.fetch.call(this, options);
  
  },

  parse: function (response) {
    
    var data = _.where(response.labels, { 
      labelListVisibility: 'labelShow'
    });

    // Set the default label as active
    _.findWhere(data, {'name' : 'INBOX'}).active = true;

    return data;
  
  }

});
