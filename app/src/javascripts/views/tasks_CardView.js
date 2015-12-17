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

  presenter: require('../presenters/tasks_itemPresenter.js'),

  template: _.template(require('../../templates/tasks_CardTemplate.html')),

  toggle: function () {
    this.model.toggle();
  },

  back: function () {
    Backbone.trigger(config.name + ':goto', '');
  },

  onEscape: function (event) {
    if (event.which === 27) {
      this.back();
    }
  },

  delete: function () {
    this.model.destroy();
    var that = this;
    this.$el.fadeOut('fast', function () {
      that.remove();
      Backbone.trigger(config.name + ':goto', '');
    });  
  },

  updateTitle: function () {
    this.model.save({'title': this.$('#title-input').val().trim()}, {wait: true});
  },

  updateDetails: function () {
    this.model.save({'details': this.$('#details-input').val().trim()}, {wait: true});
  },

  render: function () {

    // Build template
    var helpers = _.isFunction(this.presenter) ? this.presenter(this.model) : this.model.toJSON();
    var $compiled = _.isFunction(this.template) ? $(this.template(helpers)) : $(template);
    this.prepare($compiled);
    
    if (helpers.isComplete()) {
      this.$('#toggle').toggleClass('mdl-color--green');
    }

    return this.$el;
  }
});

module.exports = CardView;
