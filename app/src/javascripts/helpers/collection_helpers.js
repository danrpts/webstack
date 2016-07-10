'use strict';

var $ = require('jquery');
var backbone = require('backbone');
module.exports = {

  sync: function () {
    return this.promise = backbone.Collection.prototype.sync.apply(this, arguments);
  },

  // TODO: 3 layer lookup local, cache, server
  // https://youtu.be/P0YIdsJqKV4
  lookup: function (itemid) {

    var model;

    // Find model in local collection
    if (model = this.get(itemid)) {

      // Set it resolved on the model for presenter/template logic
      model.promise = $.Deferred().resolveWith(this, [model]).promise();

    }

    // Try to find cached model in local storage
    else {

      // First create an instance and fetch it
      model = this.add({ id: itemid });

      // Fetch from cache
      model.fetch();

      // Note: the callback receives the serialized model

    }

    return model;

  }

}