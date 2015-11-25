var Backbone = require('backbone');
var Collection = require('../classes/Collection_class.js');

var ListCollection = Collection.extend({

  model: require('./tasks_ItemModel.js'),
  
  localStorage: new Backbone.LocalStorage('TasksApp')

});

module.exports = ListCollection;
