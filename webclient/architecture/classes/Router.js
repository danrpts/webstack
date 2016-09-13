'use strict';

var _ = require('underscore');

var backbone = require('backbone');

var helpers = require('../helpers/router_helpers.js');

var create = _.isFunction(Object.create) ? Object.create : _.create;

var Router = module.exports = function (options) {
  backbone.Router.apply(this, arguments);
}

Router.prototype = create(backbone.Router.prototype);

_.extend(Router.prototype, helpers);

Router.extend = backbone.Router.extend;
