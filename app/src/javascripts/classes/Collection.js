'use strict';

var $ = require('jquery');
var _ = require('underscore');
var backbone = require('backbone');
var helpers = require('../helpers/model_helpers.js');
var create = _.isFunction(Object.create) ? Object.create : _.create;

var specials =  {

  // THOUGHT:
  // This logic exists implicitly in controller/view flow
  // REF:
  // https://youtu.be/P0YIdsJqKV4
  lookup: function (itemid) {
    var model;

    // Find model in local collection
    if (model = this.get(itemid)) {

      // Return as a resolved promise
      model = $.Deferred().resolveWith(this, [model]);

    }

    // Try to find cached model in local storage
    else {

      // First create an instance
      model = this.add({ id: itemid });

    }

    // Then return as a promise
    return model.promise();

  }

}

var Collection = module.exports = function (models, options) {
  backbone.Collection.apply(this, arguments);
}

Collection.prototype = create(backbone.Collection.prototype);

_.extend(Collection.prototype, specials, helpers);

Collection.extend = backbone.Collection.extend;
