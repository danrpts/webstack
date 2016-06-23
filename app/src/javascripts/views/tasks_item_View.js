'use strict';

var View = require('../classes/View.js');

module.exports = View.extend({

  template: require('../../templates/tasks_item_template.html'),

  events: {
    'mouseup .toggle' : 'toggle',
    'mouseup .open' : 'open',
    'mouseup .delete' : 'delete'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  toggle: function () {
    this.model.toggle();
  },

  open: function () {
     window.transition.to('tasks/' + this.model.id);
  },

  delete: function () {
    this.model.destroy();
    this.remove();
  }
  
});
