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

  presenter: require('../presenters/tasks_itemPresenter.js'),

  template: _.template(require('../../templates/tasks_ItemTemplate.html')),

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
    var that = this;
    this.$el.fadeOut('slow', function () {
      that.remove();
    });
  },

  render: function () {

    // Build template
    var helpers = _.isFunction(this.presenter) ? this.presenter(this.model) : this.model.toJSON();
    var $compiled = _.isFunction(this.template) ? $(this.template(helpers)) : $(template);
    this.prepare($compiled);

    if (helpers.isComplete()) {
      this.$('.open').addClass('complete');
    }

    return this.$el;
  }
});

module.exports = ItemView;
