'use strict';

var backbone = require('backbone');

var Collection = require('../classes/Collection.js');

var Task_Item_Model = require('../models/Task_Item_Model');

module.exports = Collection.extend({

  model: Task_Item_Model,
  
  localStorage: new backbone.LocalStorage('TasksApp')

});
