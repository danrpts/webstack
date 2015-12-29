var _ = require('underscore');
var Backbone = require('backbone');
var Model = require('../classes/Model.js');
var Collection = require('../classes/Collection.js');

var ItemModel = Model.extend({

  defaults: {
    'due': null,
    'completed': null,
    'details': null,
    'created': null
  },

  toggle: function (options) {

    _.defaults(options, {
      wait: true
    });

    this.save({ 'completed' : !this.get('completed') ? Date.now() : null }, options);

  },

  validate: function (attributes) {

    if ('title' in attributes && attributes.title.length === 0) {
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