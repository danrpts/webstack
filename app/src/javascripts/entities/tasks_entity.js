var _ = require('underscore');
var List = require('../models/tasks_Collection.js');

module.exports = _.extend({
  entity: new List.Collection()
}, List);
