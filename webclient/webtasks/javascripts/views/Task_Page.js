'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/task_page.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  defaultViews: {
    'header': 'toolBar',
    'main':   'taskCard'
  },

  toolBar: function () {
    var account = require('../singletons/account_singleton.js');
    var ToolBar = require('./Tool_Bar.js');
    return new ToolBar({ model: account });
  },

  taskCard: function () {
    var TaskCard = require('./Task_Card.js');
    return new TaskCard({ model: this.model });
  }

});
