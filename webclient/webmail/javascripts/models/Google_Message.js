'use strict';

var $ = require('jquery');

var _ = require('underscore');

var Model = require('../../../architecture/classes/Model.js');

module.exports = Model.extend({

  urlRoot: 'https://www.googleapis.com/gmail/v1/users/me/messages',

  defaults : {
    'id' : undefined,
    'threadId' : undefined
  },

  // Todo: Delete from local and remote collection, goto next message
  archive: function () {},

  // Todo: Keep marked as unread (unprocesses), goto next message
  ignore: function () {},

  // Todo: Open dialog to send to someone else, goto next message
  forward: function () {},

  // Todo: Mark as read (processed), open message in composer in reply mode
  respond: function () {},

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

  hasLabel: function (label) {

    var labels = this.get('labelIds');

    return !! labels && labels.indexOf(label.toUpperCase()) > -1;

  },

  getHeaders: function () {

    var payload = this.get('payload');

    // Cache the result
    return !! payload && _.memoize(function () {

      var names = _.pluck(payload.headers, 'name');

      var values = _.pluck(payload.headers, 'value');

      return _.object(names, values);

    })();

  },

  // Todo: Needs work or rewrite, does not handle all message body types
  getBody: function () {

    function recursePayload (payload) {

      return (payload.mimeType === 'text/html') 

      ? payload.body.data

      : _.reduce(payload.parts, function (memo, part) {
        
        return memo || recursePayload(part);

      }, undefined);

    }

    var payload = this.get('payload');

    // Cache the result
    return !! payload && _.memoize(function () {

      var body = recursePayload(payload).

      replace(/-/g, '+').

      replace(/_/g, '/').
      
      replace(/\s/g, '');

      return window.atob(body);

    })();

  },

  isUnread: function () {
   
    return this.hasLabel('unread');
  
  },

  getSnippet: function () {

    return this.get('snippet');
  
  },

  getHeader: function (name) {

    return this.getHeaders()[name];

  }

});
