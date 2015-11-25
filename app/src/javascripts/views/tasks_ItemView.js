var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View_class.js');
var ItemPresenter = require('../presenters/tasks_ItemPresenter.js');

var ItemView = View.extend({

  events: {
    'mouseup #toggle': 'toggle',
    'dblclick #open': 'open',
    'mouseup #delete': 'delete'
  },

  template: _.template(require('../../templates/tasks_ItemTemplate.html')),

  initialize: function () {
    this.listenTo(this.model, 'destroy', this.remove);
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
  },

  render: function () {

    var helpers = new ItemPresenter({model: this.model});
    var $compiled = $(this.template(helpers));
    if (!!this.rendered) {
      this.$el.html($compiled.html());
      console.log('Re-rendering item: %s', this.model.get('text'));
    } else {
      this.setElement($compiled);
      this.rendered = true;
      console.log('Initial item render for: %s', this.model.get('text'));
    }
    
    componentHandler.upgradeElements(this.el);
    if (helpers.isComplete()) {
      this.$el.addClass('complete');
      this.el.querySelector('#toggle').MaterialCheckbox.check();
    }
    return this.$el;
  }
});

module.exports = ItemView;
