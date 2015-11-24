var _ = require('underscore');
var Presenter = require('../classes/Presenter_class.js');

var ListPresenter = Presenter.extend({

  totalComplete: function () {
    return _.where(this.data, {'complete': true}).length;
  },

  isEmpty: function () {
    return this.collection.size() === 0;
  }

});

module.exports = ListPresenter;
