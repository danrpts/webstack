'use strict';

var Task_Item_View = require('../views/Task_Item_View.js');

var tasks = require('../singletons/tasks_singleton.js');

module.exports = function (id, options) {
  
  var task = tasks.lookup(id);

  var task_item_view = new Task_Item_View({ model: task });

  return task_item_view;

}
