var _ = require('underscore');
var Backbone = require('backbone');

var View = function (options) {
  Backbone.View.prototype.constructor.call(this, options);
}

_.extend(View.prototype, Backbone.View.prototype, {

});

View.extend = Backbone.View.extend;

module.exports = View;