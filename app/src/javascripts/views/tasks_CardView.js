var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var config = require('../config/tasks_config.js');
var closure = require('../helpers/presenter_helpers.js');

var CardView = View.extend({

  events: {
    'mouseup .toggle': 'toggle',
    'mouseup .back': 'back',
    'mouseup .delete': 'delete',
    'mouseup .mood': 'easterEgg',
    'blur #title-input': 'updateTitle',
    'blur #details-input': 'updateDetails'
  },

  template: require('../../templates/tasks_CardTemplate.html'),
  
  initialize: function () {
    // this is bugged
    // change is fired on sync due to localstorage, promise and events combo
    // causes premature render
    // need to rethink
    // may be an edge case
    // mixing promises and backbones event system is difficult...
    this.listenTo(this.model, 'change', this.render);
  },

  toggle: function () {
    this.model.toggle();
  },

  back: function () {
    Backbone.trigger(config.name + ':goto', '');
  },

  delete: function () {
    this.model.destroy();
    this.remove();
    this.back();
  },

  easterEgg: function () {
    this.$('.mdl-card__title').toggleClass('cats');
  },

  updateTitle: function () {
    this.model.save({'title': this.$('#title-input').val().trim()}, {wait: true});
  },

  updateDetails: function () {
    this.model.save({'details': this.$('#details-input').val().trim()}, {wait: true});
  }
  
});

module.exports = CardView;
