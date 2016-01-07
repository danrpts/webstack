var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('../helpers/model_helpers.js');
var create = _.isFunction(Object.create) ? Object.create : _.create;

var Model = module.exports = function (attributes, options) {
  Backbone.Model.apply(this, arguments);
}

Model.prototype = create(Backbone.Model.prototype);

_.extend(Model.prototype, helpers);

Model.extend = Backbone.Model.extend;
