var _ = require('underscore');

var helpers = {

  isComplete: function () {
    return !!this.complete;
  },

  hasDetails: function () {
    return ("details" in this && this.details.length > 0);
  }

};

var buildPresenter = function (resource) {
  return _.extend(resource.toJSON(), helpers);
}

module.exports = buildPresenter;
