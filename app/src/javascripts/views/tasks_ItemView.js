var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var itemPresenter = require('../presenters/tasks_itemPresenter.js');
var config = require('../config/tasks_config.js');

var ItemView = View.extend({

  events: {
    'mouseup #toggle': 'toggle',
    'dblclick .text': 'open',
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

    var helpers = itemPresenter(this.model);
    var $compiled = $(this.template(helpers));

    // When it's the initial render
    if (!this.rendered) {
      this.setElement($compiled);
      this.rendered = true;
    }

    // When it's a re-render
    else {
      this.$el.html($compiled.html());
    }

    // MDL
    componentHandler.upgradeElements(this.el);
    if (helpers.isComplete()) {
      this.$('#title').addClass('complete');
      this.el.querySelector('#toggle').MaterialCheckbox.check();
    }

    return this.$el;
  }
});

module.exports = ItemView;
