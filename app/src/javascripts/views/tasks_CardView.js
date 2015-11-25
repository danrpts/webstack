var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var itemPresenter = require('../presenters/tasks_itemPresenter.js');

var CardView = Backbone.View.extend({

  events: {
    'keyup': 'onEscape',
    'mouseup #toggle': 'toggle',
    'mouseup #back': 'back',
    'mouseup #delete': 'delete',
    'blur #title-input': 'updateTitle',
    'blur #details-input': 'updateDetails'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  template: _.template(require('../../templates/tasks_CardTemplate.html')),

  toggle: function () {
    this.model.toggle();
  },

  back: function () {
    Backbone.trigger('router:goto', '');
  },

  onEscape: function (event) {
    if (event.which === 27) {
      this.back();
    }
  },

  delete: function () {
    this.model.destroy();
    this.remove();
    this.back();
  },

  updateTitle: function () {
    this.model.save({'title': this.$('#title-input').val().trim()}, {wait: true});
  },

  updateDetails: function () {
    this.model.save({'details': this.$('#details-input').val().trim()}, {wait: true});
  },

  render: function () {

    var helpers = itemPresenter(this.model);
    var $compiled = $(this.template(helpers));

    if (this.rendered) {

      // Re-renders
      this.$el.html($compiled.html());
    } else {

      // Initial render
      this.setElement($compiled);
      this.rendered = true;
    }
    
    if (helpers.isComplete()) {
      this.$('#toggle').toggleClass('mdl-color--green');
    }
    componentHandler.upgradeElements(this.el);
    return this.$el;
  }
});

module.exports = CardView;
