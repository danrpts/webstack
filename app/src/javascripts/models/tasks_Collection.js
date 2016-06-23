'use strict';

var backbone = require('backbone');
var Collection = require('../classes/Collection.js');

module.exports = Collection.extend({

  model: require('./tasks_Model.js'),
  
  localStorage: new backbone.LocalStorage('TasksApp')

});
