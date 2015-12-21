var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('../helpers/view_helpers.js');
var create = _.isFunction(Object.create) ? Object.create : _.create;

function View (options) {
  Backbone.View.apply(this, arguments);
}

View.prototype = create(Backbone.View.prototype);

_.extend(View.prototype, helpers);

View.extend = Backbone.View.extend;

module.exports = View;
