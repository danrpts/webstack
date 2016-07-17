'use strict';

var Task_List_View = require('../views/Task_List_View.js');

var tasks = require('../singletons/tasks_singleton.js');

module.exports = function () {

  tasks.fetch();

  var task_list_view = new Task_List_View({ collection: tasks });

  return task_list_view;
  
}