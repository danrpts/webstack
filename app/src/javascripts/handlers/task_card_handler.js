'use strict';

var Task_Card_View = require('../views/Task_Card_View.js');

var tasks = require('../singletons/tasks_singleton.js');

module.exports = function (id, options) {
  
  var task = tasks.lookup(id);

  var task_card_view = new Task_Card_View({ model: task });

  return task_card_view;

}
