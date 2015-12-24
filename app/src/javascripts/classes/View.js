var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('../helpers/view_helpers.js');
var create = _.isFunction(Object.create) ? Object.create : _.create;

var specials = {

  // TODO: move this back into presenter but use event listener
  // Note: This may be unecessary, but just for good measure
  remove: function () {

    // Release the context
    (!!this.presenter) && this.presenter.release();
    Backbone.View.prototype.remove.apply(this, arguments);
  }

}

function View (options) {
  Backbone.View.apply(this, arguments);
}

View.prototype = create(Backbone.View.prototype);

_.extend(View.prototype, specials, helpers);

View.extend = Backbone.View.extend;

module.exports = View;
