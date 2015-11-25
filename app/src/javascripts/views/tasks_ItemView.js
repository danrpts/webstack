var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var ItemPresenter = require('../presenters/tasks_ItemPresenter.js');

var ItemView = Backbone.View.extend({

  events: {
    'mouseup #toggle': 'toggle',
    'dblclick #open': 'open',
    'mouseup #delete': 'delete'
  },

  template: _.template(require('../../templates/tasks_ItemTemplate.html')),

  initialize: function () {
    // Nothing yet
  },

  toggle: function () {
    this.model.toggle();
    this.$el.toggleClass('complete');
    this.el.querySelector('#toggle').MaterialCheckbox.checkToggleState();
  },

  open: function () {
    Backbone.trigger('router:goto', 'tasks/' + this.model.id);
  },

  delete: function () {
    this.model.destroy();
    this.remove();
  },

  render: function () {

    var helpers = new ItemPresenter({model: this.model});
    var $compiled = $(this.template(helpers));

    if (this.rendered) {

      // Re-renders
      this.$el.html($compiled.html());
    } else {

      // Initial render
      this.setElement($compiled);
      this.rendered = true;
    }

    console.log(this.model.toJSON());
    
    componentHandler.upgradeElements(this.el);
    if (helpers.isComplete()) {
      this.$el.addClass('complete');
      this.el.querySelector('#toggle').MaterialCheckbox.check();
    }
    return this.$el;
  }
});

module.exports = ItemView;
