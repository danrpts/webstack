var _ = require('underscore');
var Backbone = require('backbone');

// An object that provides helpers and model attributes to templates
function Presenter (options) {

  // Fill data with raw model or collection
  if (!!options.model) this.data = options.model.toJSON();
  else if (!!options.collection) this.data = options.collection.toJSON();

  return this;
}

Presenter.extend = Backbone.Model.extend;

module.exports = Presenter;