var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var ItemPresenter = require('../presenters/tasks_ItemPresenter.js');

var CardView = Backbone.View.extend({

  events: {
    'mouseup #back': 'back',
    'mouseup #delete': 'delete',
    'blur #title': 'updateTitle',
    'blur #details': 'updateDetails'
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

  updateTitle: function () {
    this.model.save({'title': this.$('#title').val().trim()});
  },

  updateDetails: function () {
    this.model.save({'details': this.$('#details').val().trim()});
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
