var _ = require('underscore');
var create = _.isFunction(Object.create) ? Object.create : _.create;

var helpers = {

  total: function (key) {
    return this.entity.length - _.where(this.entity, {key: false}).length;
  }

}

module.exports = function (entity) {
  var presenter = create(helpers);
  presenter.entity = entity.toJSON();
  return presenter;
}
