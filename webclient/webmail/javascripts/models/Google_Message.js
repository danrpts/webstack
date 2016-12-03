'use strict';

var $ = require('jquery');

var _ = require('underscore');

var humanTime = require('human-time');

var Checkbox = require('./Checkbox.js')

module.exports = Checkbox.extend({

  urlRoot: 'https://www.googleapis.com/gmail/v1/users/me/messages',

  defaults : {
    'id' : undefined,
    'threadId' : undefined
  },

  /* "Low level" REST wrappers; Think of these as priming the default functions */

  // Todo: clean this up because they are all doing the same thing
  // maybe by creating a way to set beforeSend on the model and the 
  // arch sets it up to be used on each sync

  // GET
  fetch: function (options) {

    var account = require('../singletons/account.js');
    
    options = options || {};

    var beforeSend = options.beforeSend;
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      if (beforeSend) return beforeSend.apply(this, arguments);
    }
    
    return Checkbox.prototype.fetch.call(this, options);

  },

  // DELETE
  destroy: function () {

    var account = require('../singletons/account.js');

    options = options || {};

    var beforeSend = options.beforeSend;
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      if (beforeSend) return beforeSend.apply(this, arguments);
    }

    Checkbox.prototype.destroy.call(this, options);
  },

  // POST / PUT
  save: function (key, val, options) {

    var account = require('../singletons/account.js');
    
    options = options || {};

    console.log(options);

    var beforeSend = options.beforeSend;
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      if (beforeSend) return beforeSend.apply(this, arguments);
    }
    
    // Call prototype save w/o attr
    return Checkbox.prototype.save.call(this, key, val, options);

  },

  // POST
  procedure: function (name, options) {

    var account = require('../singletons/account.js');
    
    options = options || {};

    var beforeSend = options.beforeSend;
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      if (beforeSend) return beforeSend.apply(this, arguments);
    }
  
    return Checkbox.prototype.procedure.call(this, name, options);

  },

  /* "High Level" message procedures */

  // Higher level POST operation
  trash: function () {

    var messages = require('../singletons/messages.js');

    // Immediately remove for perceived performance
    messages.remove(this);

    // Then invoke the remote procedure
    this.procedure('trash');

    // If error add back to collection and handle error
  
  },

  // Higher level POST operation
  send: function () {

    // Build rfc message from attributes
    var body = '';

    body += 'From: <' + this.get('from') + '>' + '\r\n';
    body += 'To: <' + this.get('to') + '>' + '\r\n';
    body += 'Subject: ' + this.get('subject') + '\r\n';
    body += 'Date: ' + new Date().toUTCString(); + '\r\n\n';
    
    body += this.get('body'); + '\r\n\n';
    
    // Then invoke the remote procedure
    //this.procedure('send');
    console.log(body);
  
  },

  /* "High Level" message procedures */

  // Todo: Keep marked as unread (unprocesses), goto next message
  // Higher level NOOP operation
  ignore: function () {},

  // Todo: Open dialog to send to someone else, goto next message
  // Higher level POST operation
  forward: function () {},

  // Todo: Mark as read (processed), open message in composer in reply mode
  // Higher level POST operation
  respond: function () {},


  /* Payload helpers */

  // Check message for google type label
  hasLabel: function (label) {

    var labels = this.get('labelIds');

    return !! labels && labels.indexOf(label.toUpperCase()) > -1;

  },

  // Extract headers from message payload
  getHeaders: function () {

    var payload = this.get('payload');

    // Cache the result
    return !! payload && _.memoize(function () {

      var names = _.pluck(payload.headers, 'name');

      var values = _.pluck(payload.headers, 'value');

      return _.object(names, values);

    })();

  },

  // Extract body from message headers
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

  // Todo: Actually check for message attachment
  hasAttachment: function () {
  
    return true;

  },

  isHtml: function () {

    var payload = this.get('payload');
    
    return (payload.mimeType === 'text/html');

  },

  getHeader: function (name) {
    var header = this.getHeaders()[name];
    return ! header ? '(No ' + name + ')' : header.replace(/['"]+/g, '');

  },

  /* Attribute helpers */

  getDate: function () {
  
    return this.fault('date', function () {

      return this.getHeader('Date');
    
    });
  
  },

  getHumanDate: function () {
  
    return new Date(this.getDate()).toDateString();
  
  },

  getTimeAgo: function () {

    return humanTime(new Date(this.getDate()));
  
  },

  getSubject: function () {
  
    return this.fault('subject', function () {

      return this.getHeader('Subject');
    
    });

  },

  getFrom: function () {

    return this.fault('from', function () {

      // Set default
      var name = '(No From)';
      var email = this.getHeader('From');

      // Extract email and name
      var start = email.indexOf('<');
      if (start != -1) {

        // Remove quotes
        email = email.replace(/['"]+/g, '');

        // Pivot backwards for name
        var spaced = email.substring(0, start-1);
        name = ! spaced ? name : spaced;

        // Pivot forwards for email
        var end = email.indexOf('>', start);
        var bracketed = email.substring(start+1, end);
        email = ! bracketed ? email : bracketed;
      }

      return [name, email];

    });

  },

  getTo: function () {

    return this.fault('to', function () {

      // Set default
      var name = this.getHeader('To');

      // Extract email address
      var start = name.indexOf('<');
      if (start != -1) {

          // Pivot forwards for email
          var end = name.indexOf('>', start);
          var bracketed = name.substring(start+1, end);
          name = ! bracketed ? name : bracketed;
      }
    
      return name;

    });

  },

  getSnippet: function () {
    
    return this.get('snippet');

  }

});
