var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var config = require('../config/tasks_config.js');

var ItemView = View.extend({

  events: {
    'mouseup  .toggle' : 'toggle',
    'dblclick .open'   : 'open',
    'mouseup  .delete' : 'delete'
  },

  template: require('../../templates/tasks_ItemTemplate.html'),

  presenter: require('../presenters/tasks_itemPresenter.js'),

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  toggle: function () {
    this.model.toggle();
  },

  open: function () {
    Backbone.trigger(config.name + ':goto', 'tasks/' + this.model.id);
  },

  delete: function () {
    this.model.destroy();
    this.remove();
  }
  
});

module.exports = ItemView;
