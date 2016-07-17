'use strict';

var _ = require('underscore');
var backbone = require('backbone');
var rendering_helpers = require('../helpers/render_helpers.js');
var compositing_helpers = require('../helpers/composite_helpers.js');
var create = _.isFunction(Object.create) ? Object.create : _.create;

var View = module.exports = function (options) {
  backbone.View.apply(this, arguments);
  this.initializeCompositing();
}

View.prototype = create(backbone.View.prototype);

_.extend(View.prototype, rendering_helpers, compositing_helpers);

View.extend = backbone.View.extend;
