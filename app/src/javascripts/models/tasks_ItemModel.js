var _ = require('underscore');
var Backbone = require('backbone');

var ItemModel = Backbone.Model.extend({

  defaults: {
    'complete': false
  },

  toggle: function () {
    this.save({complete: !this.get('complete')}, {wait: true});
  },

  validate: function (attributes) {
    if ("text" in attributes && attributes.text.length === 0) {
      return "Text cannot be empty.";
    }
  }

});

module.exports = ItemModel;