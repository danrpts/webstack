var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('../helpers/view_helpers.js');
var create = _.isFunction(Object.create) ? Object.create : _.create;

function View (options) {
  var self = (this instanceof View) ? this : create(View.prototype);
  Backbone.View.apply(self, arguments);
}

View.prototype = create(Backbone.View.prototype);

_.extend(View.prototype, helpers);

View.extend = Backbone.View.extend;

module.exports = View;
