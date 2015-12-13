var _ = require('underscore');
var Backbone = require('backbone');

var Router = function (options) {
  Backbone.Router.prototype.constructor.call(this, options);
}

_.extend(Router.prototype, Backbone.Router.prototype, {

});

Router.extend = Backbone.Router.extend;

module.exports = Router;