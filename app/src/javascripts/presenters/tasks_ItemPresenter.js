var _ = require('underscore');

var helpers = {

  has: function (key) {
    return (key in this && this[key].length > 0);
  },

  isComplete: function () {
    return !!this.completion;
  },

  format: function (key) {
    var goal = new Date(this[key]);
    var today = new Date();
    var time = ' @ ' + goal.getHours() % 12 + ':' + goal.getMinutes();
    var date = ' on ' + goal.toDateString();
    return (goal.getDay() === today.getDay()) ? time : date;
  }

}

module.exports = function (resource) {
  return _.extend(resource.toJSON(), helpers);
}
