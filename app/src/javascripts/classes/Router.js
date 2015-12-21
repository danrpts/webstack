var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('../helpers/router_helpers.js');
var create = _.isFunction(Object.create) ? Object.create : _.create;

function Router (options) {
  options = options || {};
  options['controller'] && _.extend(this, _.pick(options.controller, _.functions(options.controller)));
  Backbone.Router.apply(this, arguments);
}

Router.prototype = create(Backbone.Router.prototype);

_.extend(Router.prototype, helpers);

Router.extend = Backbone.Router.extend;

module.exports = Router;
