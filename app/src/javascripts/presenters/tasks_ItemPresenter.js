var _ = require('underscore');

var helpers = {

  randomImage: function () {
    return 'http://thecatapi.com/api/images/get?format=src&type=gif';
  },

  has: function (key) {
    return (key in this && this[key].length > 0);
  },

  isComplete: function () {
    return !!this.completed;
  },

  format: function (key) {
    var goal = new Date(this[key]);
    var today = new Date();
    var time = key + ' @ ' + goal.toLocaleTimeString()
    var date = key + ' on ' + goal.toDateString();
    return (goal.getDay() === today.getDay()) ? time : date;
  }

}

module.exports = function (resource) {
  return _.extend(resource.toJSON(), helpers);
}
