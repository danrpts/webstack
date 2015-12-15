var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('../helpers/router_helpers.js');

var Router = function (options) {
  Backbone.Router.call(this, options);
}

Router.prototype = Object.create(Backbone.Router.prototype);

_.extend(Router.prototype, helpers);

Router.extend = Backbone.Router.extend;

module.exports = Router;
