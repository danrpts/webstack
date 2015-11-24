var Backbone = require('backbone');

var ListCollection = Backbone.Collection.extend({

  model: require('./tasks_ItemModel.js'),
  
  localStorage: new Backbone.LocalStorage('TasksApp')

});

module.exports = ListCollection;
