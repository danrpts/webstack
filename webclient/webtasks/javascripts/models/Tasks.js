'use strict';

var backbone = require('backbone');

var Collection = require('../../../architecture/classes/Collection.js');

var Task = require('../models/Task');

module.exports = Collection.extend({

  model: Task,
  
  localStorage: new backbone.LocalStorage('TasksApp')

});
