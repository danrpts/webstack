var _ = require('underscore');
var Backbone = require('backbone');

var View = function () {
  Backbone.View.apply(this, arguments);
  return this;
}

// augments
// http://ianstormtaylor.com/assigning-backbone-subviews-made-even-cleaner/
View.prototype.assign = function (selector, view) {
    var selectors;
    if (_.isObject(selector)) {
        selectors = selector;
    } else {
        selectors = {};
        selectors[selector] = view;
    }
    if (!selectors) return;
    _.each(selectors, function (view, selector) {
      view.setElement(this.$(selector)).render();
    }, this);
}


View.extend = Backbone.View.extend;

_.extend(View.prototype, Backbone.View.prototype);

module.exports = View;