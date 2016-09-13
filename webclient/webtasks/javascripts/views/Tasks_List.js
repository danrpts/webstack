'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

var TaskItem = require('./Task_Item.js');

module.exports = View.extend({

  template: require('../../templates/tasks_list.html'),

  initialize: function () {
    this.listenTo(this.collection, 'update', this.render);
  },

  // Construct the list with the compositor w/ GC in mind
  postrender: function () {
    
    componentHandler.upgradeElements(this.el);

    var children = this.collection.map(function (task) {
      return new TaskItem({ model: task });
    });

    // The setViews is optimized to use a document fragment
    this.setViews(children, 'ul');

  }

});
