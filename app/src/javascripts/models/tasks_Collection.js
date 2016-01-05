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

  check: function (bool) {

    var options = { wait: true }

    this.save({ 'completed': bool ? Date.now() : null }, options);

  },

  toggle: function () {

    !this.get('completed') ? this.check(true) : this.check(false);

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