var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var itemPresenter = require('../presenters/tasks_itemPresenter.js');

var ItemView = Backbone.View.extend({

  events: {
    'mouseup #toggle': 'toggle',
    'dblclick #title': 'open',
    'mouseup #delete': 'delete'
  },

  template: _.template(require('../../templates/tasks_ItemTemplate.html')),

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  toggle: function () {
    this.model.toggle();
  },

  open: function () {
    Backbone.trigger('router:goto', 'tasks/' + this.model.id);
  },

  delete: function () {
    this.model.destroy();
    var that = this;
    this.$el.fadeOut('slow', function () {
      that.remove();
    });
  },

  render: function () {

    var helpers = itemPresenter(this.model);
    var $compiled = $(this.template(helpers));

    if (!!this.rendered) {

      // Re-renders
      this.$el.html($compiled.html());
    } else {

      // Initial render
      this.setElement($compiled);
      this.rendered = true;
    }
    
    componentHandler.upgradeElements(this.el);
    if (helpers.isComplete()) {
      this.$('#title').addClass('complete');
      this.el.querySelector('#toggle').MaterialCheckbox.check();
    }
    return this.$el;
  }
});

module.exports = ItemView;
