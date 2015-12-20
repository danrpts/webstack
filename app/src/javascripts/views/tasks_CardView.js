var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var config = require('../config/tasks_config.js');

var CardView = View.extend({

  events: {
    'mouseup .toggle': 'toggle',
    'mouseup .back': 'back',
    'mouseup .delete': 'delete',
    'blur #title-input': 'updateTitle',
    'blur #details-input': 'updateDetails'
  },

  template: require('../../templates/tasks_CardTemplate.html'),

  presenter: require('../presenters/tasks_itemPresenter.js'),

  initialize: function () {

    // this is bugged
    // change is fired on sync due to localstorage, promise and events combo
    // causes premature render
    // need to rethink
    // may be an edge case
    // mixing promises and backbones event system is difficult...
    this.listenTo(this.model, 'change', this.render);
  },

  back: function () {
    Backbone.trigger(config.name + ':goto', '');
  },

  toggle: function () {
    this.model.toggle();
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
  }
  
});

module.exports = CardView;
