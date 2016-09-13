'use strict';

var $ = require('jquery');

var _ = require('underscore');

var Collection = require('../../../architecture/classes/Collection.js');

module.exports = Collection.extend({

  url: 'https://www.googleapis.com/batch',

  model: require('./Google_Message.js'),

  // Prefetch the message ids first.
  prefetch: function (data) {

    var collection = this;

    var promise = $.Deferred();

    var account = require('../singletons/account.js');

    var options = {
      url: 'https://www.googleapis.com/gmail/v1/users/me/messages',
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      },
      success: function (result) {

        // Todo
        collection._nextPageToken = result.nextPageToken;

        promise.resolveWith(collection, [result.messages]);
      }
    }

    if (data) options.data = data;

    $.ajax(options);

    return promise;

  },

  // Batch fetch messages using the prefetched ids.
  fetch: function (options) {

    options = options || {};

    var collection = this;

    var promise = this.prefetch(options.data);

    _.extend(options, {
      type: 'POST',
      dataType: 'text'
    });

    _.defaults(options, {
      reset: true
    });

    var boundary = 'batch_' + _.random(Math.pow(2, 16));
    var account = require('../singletons/account.js');
    var beforeSend = options.beforeSend;
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      xhr.setRequestHeader('Content-Type', 'multipart/mixed; boundary="' + boundary + '"');
      if (beforeSend) return beforeSend.apply(this, arguments);
    }

    promise.

    done(function (ids) {

      if (!! ids) {

        var body = '';
        ids.forEach(function (message) {
          body += '--' + boundary + '\r\n';
          body += 'Content-Type: application/http' + '\r\n\r\n';
          body += 'GET /gmail/v1/users/me/messages/' + message.id + '\r\n\r\n';
        });
        body += '--' + boundary + '--';
        options.data = body;

        // return ?
        Collection.prototype.fetch.call(collection, options);

      } else {

        collection.promise = $.when();
        collection.reset();
        collection.trigger('sync');

      }

    });

    // Return prefetch promise for now
    return promise;

  },

  // Todo: Needs rewrite
  parse: function(response) {

    // Not the same delimiter in the response as we specify ourselves in the request,
    // so we have to extract it.
    var delimiter = response.substr(0, response.indexOf('\r\n'));

    var parts = response.split(delimiter);
    
    // The first part will always be an empty string. Just remove it.
    parts.shift();
    
    // The last part will be the "--". Just remove it.
    parts.pop();

    var result = [];
    
    for (var i = 0; i < parts.length; i++) {

      var part = parts[i];
      
      var p = part.substring(part.indexOf("{"), part.lastIndexOf("}") + 1);
      
      result.push(JSON.parse(p));
    
    }

    return result;
  
  },

    // Local collection filtering
  filter: function (pattern, options) {

    // TODO: Implement collection filtering for pattern

  },

  // Remote collection fetching
  search: function (queries, options) {

    options = options || {};

    _.extend(options, {

      data: $.param({ q: queries.join(' ') })
    
    });

    return this.fetch(options);
  
  },

  refresh: function (queries, options) {

    return this.search.apply(this, arguments);
  
  },

  next: function (nextPageToken, options) {

    nextPageToken = nextPageToken || this._nextPageToken;

    options = options || {};

    _.extend(options, {
      data: $.param({ pageToken: nextPageToken }),
      reset: false
    });

    this.fetch(options);

  }
    
});
