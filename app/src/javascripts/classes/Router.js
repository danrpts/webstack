var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('../helpers/router_helpers.js');

var Router = function (options) {
  options = options || {};
  options['controller'] && _.extend(this, _.pick(options.controller, _.functions(options.controller)));
  Backbone.Router.call(this, options);
}

Router.prototype = Object.create(Backbone.Router.prototype);

_.extend(Router.prototype, helpers);

Router.extend = Backbone.Router.extend;

module.exports = Router;
