'use strict';

var $ = require('jquery');

var _ = require('underscore');

var backbone = require('backbone');

var Model = require('../../../architecture/classes/Model.js');

module.exports = Model.extend({

  urlRoot: 'https://www.googleapis.com/upload/gmail/v1/users/me/drafts',

  defaults : {
    'to': undefined,
    'cc': undefined,
    'bcc': undefined,
    'subject': undefined,
    'body': undefined
  },

  // Todo: Delete the model locally and remotely, goto home
  discard: function () {},

  // Todo: Update the model's contents on the server, stay in draft
  save: function () {},

  // Todo: Send the draft's toRFC2822() to the To,Cc,Bcc headers
  send: function () {
    console.log(this.toJSON());
  },

  fetch: function (options) {

    var account = require('../singletons/account.js');
    
    options = options || {};

    var beforeSend = options.beforeSend;
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      if (beforeSend) return beforeSend.apply(this, arguments);
    }
    
    return Model.prototype.fetch.call(this, options);
  
  },

  toJSON: function () {
    return _.chain(this.attributes).clone().mapObject(function (resource) {
      return resource && _.isFunction(resource.toJSON) ? resource.toJSON() : resource;
    }).value();
  },

  // Todo: Return models headers and body into and RFC2822 compliant string
  toRFC2822: function () {} 

});
