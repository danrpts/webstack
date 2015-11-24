var _ = require('underscore');
var Backbone = require('backbone');

var Collection = function () {
  Backbone.Collection.apply(this, arguments);
  return this;
}

Collection.extend = Backbone.Collection.extend;

_.extend(Collection.prototype, Backbone.Collection.prototype);

module.exports = Collection;