'use strict';

var $ = require('jquery');

var _ = require('underscore');

var backbone = require('backbone');

module.exports = {

  // Wrapper around "low-level" rest helper to set/reset the promise
  sync: function (method, model, options) {

    // Reset the promise
    this.promise = $.Deferred();

    return this.promise = backbone.Model.prototype.sync.apply(this, arguments);

  },

  // Custom "low-level" rest helper to trigger a data-handling process on the server for the resource
  procedure: function (name, options) {

      options = _.extend({ parse: true }, options);

      // Inject the procedure name into the uri and call save (save is our existing POST method)
      options.url = this.url().replace(/[^\/]$/, '$&/') + encodeURIComponent(name);

      var model = this;
    
      var success = options.success;

      options.success = function(resp) {
        if (success) success.call(options.context, model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      
      // Todo: figure out how to use wrapError from this context
      //wrapError(this, options);
      
      return this.sync('create', this, options);

  },

  // This helper lets us populate the model's attributes on the fly;
  // Useful if the normal getter is expensive and we only want to run it once
  // and store its result at an easier place;
  // It is find of like a cache miss
  fault: function (attr, get, context) {

    context = context || this;

    var value = _.isFunction(get) ? get.call(context) : get; 

    // Condensed if/else; 'set' returns the model so we negate to return the value
    return this.get(attr) || ! this.set(attr, value, { silent: true }) || value;

  },

  toggle: function (attr) {
    this.set(attr, ! this.get(attr));
  },

  isPending: function () {
    return !! this.promise && this.promise.state() === 'pending';
  },

  isResolved: function () {
    return !! this.promise && this.promise.state() === 'resolved';
  }
  
}
