var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('../helpers/controller_helpers.js');
var create = _.isFunction(Object.create) ? Object.create : _.create;

var specials = {

  // TODO: move this back into presenter but use event listener
  // Note: This may be unecessary, but just for good measure
  remove: function () {

    // Release the context closure
    (!!this.presenter) && this.presenter.release();
    Backbone.View.prototype.remove.apply(this, arguments);
  }

}

// IMHO: Backbone views are controllers and the templates are views
var Controller = module.exports = function (options) {
  Backbone.View.apply(this, arguments);
}

Controller.prototype = create(Backbone.View.prototype);

_.extend(Controller.prototype, specials, helpers);

Controller.extend = Backbone.View.extend;
