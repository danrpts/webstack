var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('../helpers/model_helpers.js');

var Collection = function (models, options) {
  Backbone.Collection.apply(this, arguments);
}

Collection.prototype = Object.create(Backbone.Collection.prototype);

_.extend(Collection.prototype, helpers);

Collection.extend = Backbone.Collection.extend;

module.exports = Collection;
