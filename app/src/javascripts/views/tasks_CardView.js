var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var config = require('../config/tasks_config.js');

var CardView = View.extend({

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

  template: require('../../templates/tasks_CardTemplate.html'),

  presenter: require('../presenters/tasks_itemPresenter.js'),

  back: function () {
    Backbone.trigger(config.name + ':goto', '');
  },

  toggle: function () {
    this.model.toggle();
    this.back()
  },

  delete: function () {
    this.model.destroy();
    this.remove();
    this.back();
  },

  onEscape: function (event) {
    if (event.which === 27) {
      this.back();
    }
  },

  updateTitle: function () {
    this.model.save({'title': this.$('#title-input').val().trim()}, {wait: true});
  },

  updateDetails: function () {
    this.model.save({'details': this.$('#details-input').val().trim()}, {wait: true});
  },

  render: function () {

    // Compile allows chaining
    return this.compile();
    
  }
  
});

module.exports = CardView;
