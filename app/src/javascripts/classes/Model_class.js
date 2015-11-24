var _ = require('underscore');
var Backbone = require('backbone');

var Model = function () {
  Backbone.Model.apply(this, arguments);
  return this;
}

Model.extend = Backbone.Model.extend;

_.extend(Model.prototype, Backbone.Model.prototype);

module.exports = Model;