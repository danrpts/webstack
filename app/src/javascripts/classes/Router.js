var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('../helpers/router_helpers.js');
var create = _.isFunction(Object.create) ? Object.create : _.create;

var Router = module.exports = function (options) {

  // As always, use caution
  options = options || {};

  // If the constructor was supplied with an api
  if ('api' in options) {

    // Copy all api functions into this router
    _.extend(this, _.pick(options.api, _.functions(options.api)));
  }

  // Call the Backbone constructor
  Backbone.Router.apply(this, arguments);
  
}

Router.prototype = create(Backbone.Router.prototype);

_.extend(Router.prototype, helpers);

Router.extend = Backbone.Router.extend;
