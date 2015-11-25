var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var ItemPresenter = require('../presenters/tasks_ItemPresenter.js');

var CardView = Backbone.View.extend({

  events: {
    'mouseup #back': 'back',
    'mouseup #delete': 'delete'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  template: _.template(require('../../templates/tasks_CardTemplate.html')),

  back: function () {
    Backbone.trigger('router:goto', '');
  },

  delete: function () {
    this.model.destroy();
    this.remove();
    this.back();
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
    
    componentHandler.upgradeElements(this.el);
    return this.$el;
  }
});

module.exports = CardView;
