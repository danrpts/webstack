var _ = require('underscore');
var Backbone = require('backbone');
var Model = require('../classes/Model.js');
var Collection = require('../classes/Collection.js');

var ItemModel = Model.extend({

  defaults: {
    'due': false,
    'completed': false,
    'created': Date.now()
  },

  toggle: function (options) {
    
    _.defaults(options, {
      wait: true
    });
    this.save({completed: !this.get('completed') ? Date.now() : false}, options);

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