var Presenter = require('../classes/Presenter_class.js');

var ItemPresenter = Presenter.extend({

  isComplete: function () {
    return !!this.data.complete;
  }

});

module.exports = ItemPresenter;
