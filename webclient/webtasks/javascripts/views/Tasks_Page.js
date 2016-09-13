'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/tasks_page.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  defaultViews: {
    'header':       'toolBar',
    '#tasks-input': 'tasksInput',
    '#tasks-list':  'tasksList',
  },

  toolBar: function () {
    var account = require('../singletons/account_singleton.js');
    var ToolBar = require('./Tool_Bar.js');
    return new ToolBar({ model: account });
  },

  tasksInput: function () {
    var TasksInput = require('./Tasks_Input.js');
    return new TasksInput({ collection: this.collection });
  },

  tasksList: function () {
    var TasksList = require('./Tasks_List.js');
    return new TasksList({ collection: this.collection });
  }

});
