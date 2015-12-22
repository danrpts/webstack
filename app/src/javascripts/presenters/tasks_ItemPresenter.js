var _ = require('underscore');
var create = _.isFunction(Object.create) ? Object.create : _.create;

var helpers = {

  has: function (key) {
    return (key in this.entity && this.entity[key].length > 0);
  },

  is: function (key) {
    return (key in this.entity && !!this.entity[key]);
  },

  format: function (key) {
    var timestamp = new Date(this[key]);
    var today = new Date();
    var time = key + ' @ ' + timestamp.toLocaleTimeString()
    var date = key + ' on ' + timestamp.toDateString();
    return (timestamp.getDay() === today.getDay()) ? time : date;
  }

}

module.exports = function (entity) {
  var presenter = create(helpers);
  presenter.entity = entity.toJSON();
  return presenter;
}
