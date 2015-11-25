var Presenter = require('../classes/Presenter_class.js');

var ItemPresenter = Presenter.extend({

  isComplete: function () {
    return !!this.data.complete;
  },

  hasDetails: function () {
    return ("details" in this.data && this.data.details.length > 0);
  }

});

module.exports = ItemPresenter;
