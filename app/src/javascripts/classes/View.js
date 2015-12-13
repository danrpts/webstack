var _ = require('underscore');
var Backbone = require('backbone');

var View = function (options) {
  Backbone.View.call(this, options);
}

View.prototype = Object.create(Backbone.View.prototype);

_.extend(View.prototype, {});

View.extend = Backbone.View.extend;

module.exports = View;