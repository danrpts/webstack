'use strict';

var $ = require('jquery');

var _ = require('underscore');

var Collection = require('../../../architecture/classes/Collection.js');

module.exports = Collection.extend({

  url: 'https://www.googleapis.com/batch',

  model: require('./Google_Message.js'),

  // Prefetch the message ids first.
  prefetch: function (data) {

    //console.log('4: prefetch called');

    var deferred = $.Deferred();

    var collection = this;

    var account = require('../singletons/account.js');

    var options = {
      url: 'https://www.googleapis.com/gmail/v1/users/me/messages',
      type: 'GET',
      dataType: 'json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      },
      success: function (result) {
        collection._nextPageToken = result.nextPageToken;
        deferred.resolveWith(collection, [result.messages]);
      }
    }

    // Query string
    if (data) options.data = data;

    $.ajax(options);
    
    return deferred;

  },

  // Batch fetch messages using the prefetched ids.
  fetch: function (options) {
    
    //console.log('3: fetch called');

    /* Invarient: Prefetch, deferred and promise are undefined */

    // Set a context for callbacks
    var collection = this;

    // Initiate overall status
    var deferred = $.Deferred();
    this.promise = deferred.promise();

    /* Invarient: Prefetch is undefined while deferred and promise are pending */

    // Issue the prefetch to retreive message ids
    options = options || {};
    var prefetch = this.prefetch(options.data);

    /* Invarient: Prefetch is indeterminate while deferred and promise are pending */

    // Trigger the batch request event while all are unresolved
    this.trigger('batch:request', collection, deferred, options);

    // Override fetch options
    _.extend(options, {
      type: 'POST',
      dataType: 'text',
      data: undefined,
    });

    // Default fetch options
    _.defaults(options, {
      reset: true
    });

    // Set auth headers
    var boundary = 'batch_' + _.random(Math.pow(2, 16));
    var account = require('../singletons/account.js');
    var beforeSend = options.beforeSend;
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      xhr.setRequestHeader('Content-Type', 'multipart/mixed; boundary="' + boundary + '"');
      if (beforeSend) return beforeSend.apply(this, arguments);
    }

    // Once we have the message ids
    prefetch.done(function (ids) {

      /* Invarient: Prefetch is resolved while deferred and promise are pending */

      // Fetch each message
      if (!! ids) {

        // Form the batch request
        var body = '';
        ids.forEach(function (message) {
          body += '--' + boundary + '\r\n';
          body += 'Content-Type: application/http' + '\r\n\n';
          body += 'GET /gmail/v1/users/me/messages/' + message.id + '\r\n\n';
        });
        body += '--' + boundary + '--';
        options.data = body;

        options.success = function (result) {
          
          /* Invarient: Prototype fetch is resolved */
          
          deferred.resolveWith(collection, [result]);

          /* Invarient: Prefetch, deferred and promise are resolved */

          // Trigger the batch sync event once all are resolved
          collection.trigger('batch:sync', collection, deferred, options);   

        }

        // Fetch the messages and pipe the deferred state
        Collection.prototype.fetch.call(collection, options);

      } 

      // Spoof the sync when there aren't any message ids
      else {
        deferred.resolveWith(collection, []);

        /* Invarient: Prefetch, deferred and promise are resolved */
        
        collection.reset();
        collection.trigger('batch:sync', collection, deferred, options);  
      }

    });

    return deferred;

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

  // Keep the list sorted by date
  comparator: function(model) {
    var date = new Date(model.getHeader('Date'));
    return -date.getTime();
  },

  // Group the list by time makingknowing the list is already sorted
  groupByDate: function (callback) {
    this.chain().groupBy(function (message) {
      return message.getTimeAgo();
    })
    .mapObject(function (messages, timeago) {
      var unreadCount = messages.reduce(function (memo, message) { 
        return memo + (message.isUnread() ? 1 : 0);
      }, 0);
      callback(messages, timeago, unreadCount);  
    });
  },

    // Local collection filtering
  filter: function (pattern, options) {

    // TODO: Implement collection filtering for pattern

  },

  // Remote collection fetching
  search: function (queries, options) {
    
    //console.log('2: search called');

    options = options || {};

    _.extend(options, {
      data: $.param({ q: queries.join(' ') }),    
    });

    return this.fetch(options);
  
  },

  refresh: function (queries, options) {
    
    //console.log('1: refresh called');

    return this.search.apply(this, arguments);
  
  },

  hasMore: function() {
    return (!! this._nextPageToken);
  },

  more: function (nextPageToken, options) {

    nextPageToken = nextPageToken || this._nextPageToken;

    options = options || {};

    // Note the usage of "reset: false" which tells backbone to do a collection.set
    // and then "remove: false" tells set to not remove any stale models. Essentially,
    // this works implictly as a collection.push, but with our existing fetch method.
    _.extend(options, {
      data: $.param({ pageToken: nextPageToken }),
      reset: false,
      remove: false
    });

    return this.fetch(options);

  },

  getChecked: function () {
    return this.where({ checked: true });
  },

  getUnread: function () {

    return this.filter(function (message) {
    
      return message.isUnread();
  
    });
  
  }
    
});
