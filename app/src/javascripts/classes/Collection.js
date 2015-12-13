var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('../helpers/model_helpers.js');

var Collection = function (models, options) {
  Backbone.Collection.prototype.constructor.apply(this, arguments);
}

_.extend(Collection.prototype, Backbone.Collection.prototype, helpers);

Collection.extend = Backbone.Collection.extend;

module.exports = Collection;
