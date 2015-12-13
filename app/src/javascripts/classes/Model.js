var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('../helpers/model_helpers.js');

var Model = function (attributes, options) {
  Backbone.Model.prototype.constructor.call(this, attributes, options);
}

_.extend(Model.prototype, Backbone.Model.prototype, helpers);

Model.extend = Backbone.Model.extend;

module.exports = Model;