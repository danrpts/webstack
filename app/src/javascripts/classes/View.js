'use strict';

var _ = require('underscore');
var backbone = require('backbone');
var helpers = require('../helpers/view_helpers.js');
var create = _.isFunction(Object.create) ? Object.create : _.create;

var View = module.exports = function (options) {
  this.children = {};
  backbone.View.apply(this, arguments);
}

View.prototype = create(backbone.View.prototype);

_.extend(View.prototype, helpers);

View.extend = backbone.View.extend;
