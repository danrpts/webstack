var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('../helpers/model_helpers.js');

var Collection = function (models, options) {
  Backbone.Collection.apply(this, arguments);
}

Collection.prototype = Object.create(Backbone.Collection.prototype);

_.extend(Collection.prototype, helpers, {

  // TODO: integrate with controllers
  // REF: https://youtu.be/P0YIdsJqKV4
  // BUG: fetch returns attributes, must use callback?
  lookup: function (id) {
    var model;

    // Find model in local collection
    if (model = this.get(id)) {

      // Return as a resolved promise
      model = $.Deferred().resolveWith(this, [model]);

    }

    // Try to find cached model in local storage
    else {

      // First create an instance
      model = this.add({id: id});

    }

    // Then return as a promise
    return model.promise();

  }

});

Collection.extend = Backbone.Collection.extend;

module.exports = Collection;
