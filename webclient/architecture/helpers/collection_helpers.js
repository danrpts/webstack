'use strict';

var $ = require('jquery');

var _ = require('underscore');

var backbone = require('backbone');

module.exports = {

  sync: function (method, model, options) {

    var jqXHR = backbone.Collection.prototype.sync.apply(this, arguments);

    if (this.isResolved()) this.promise = jqXHR.promise();

    //console.log('5: sync called');

    return jqXHR;

  },

  isPending: function () {
    return !! this.promise && this.promise.state() === 'pending';
  },

  isResolved: function () {
    return !! this.promise && this.promise.state() === 'resolved';
  },

  // TODO: 3 layer lookup local, cache, server
  // https://youtu.be/P0YIdsJqKV4
  lookup: function (itemid, options) {

    var model;

    // Find model in local collection
    if (model = this.get(itemid)) {

      options = options || {};

      if (!!options.update) model.fetch(options);

      // Set it resolved on the model for presenter/template logic
      else model.promise = $.Deferred().resolve(model).promise();

    }

    // TODO: Try to find cached model in local storage
    // else if () {}

    // Fetch from server
    else {

      // First create an instance and fetch it
      model = this.add({ id : itemid });

      // Fetch from cache
      model.fetch(options);

    }

    return model;

  }

}
