var _ = require('underscore');

var helpers = {

  totalComplete: function () {
    return _.where(this, {'complete': true}).length;
  }

};

var buildPresenter = function (resource) {
  return _.extend(resource.toJSON(), helpers);
}

module.exports = buildPresenter;
