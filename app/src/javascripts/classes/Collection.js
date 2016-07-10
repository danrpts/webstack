'use strict';

var _ = require('underscore');
var backbone = require('backbone');
var helpers = require('../helpers/collection_helpers.js');
var create = _.isFunction(Object.create) ? Object.create : _.create;

var Collection = module.exports = function (models, options) {
  backbone.Collection.apply(this, arguments);
}

Collection.prototype = create(backbone.Collection.prototype);

_.extend(Collection.prototype, helpers);

Collection.extend = backbone.Collection.extend;
