'use strict';

var $ = require('jquery');

var backbone = require('backbone');

module.exports = {

  sync: function (method, model, options) {

    // Reset the promise
    this.promise = $.Deferred();

    return this.promise = backbone.Model.prototype.sync.apply(this, arguments);

  },

  isPending: function () {
    return !! this.promise && this.promise.state() === 'pending';
  },

  isResolved: function () {
    return !! this.promise && this.promise.state() === 'resolved';
  }
  
}
