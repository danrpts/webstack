var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('../helpers/model_helpers.js');

var Model = function (attributes, options) {
  Backbone.Model.call(this, attributes, options);
}

Model.prototype = Object.create(Backbone.Model.prototype);

_.extend(Model.prototype, helpers);

Model.extend = Backbone.Model.extend;

module.exports = Model;
