var _ = require('underscore');
var Backbone = require('backbone');

var Router = function () {
  Backbone.Router.apply(this, arguments);
  return this;
}

Router.extend = Backbone.Router.extend;

_.extend(Router.prototype, Backbone.Router.prototype);

module.exports = Router;