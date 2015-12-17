var _ = require('underscore');
var Backbone = require('backbone');
var Model = require('../classes/Model.js');
var Collection = require('../classes/Collection.js');

var ItemModel = Model.extend({

  defaults: {
    'due': false,
    'completion': false,
    'creation': Date.now()
  },

  toggle: function () {
    this.save({completion: !this.get('completion') ? Date.now() : false}, {wait: true});
  },

  validate: function (attributes) {
    if ("title" in attributes && attributes.title.length === 0) {
      return "Title cannot be empty.";
    }
  }

});

var ListCollection = Collection.extend({

  model: ItemModel,
  
  localStorage: new Backbone.LocalStorage('TasksApp')

});

module.exports = {

  Model: ItemModel,

  Collection: ListCollection

}