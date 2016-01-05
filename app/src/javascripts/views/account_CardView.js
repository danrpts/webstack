var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var config = require('../config/account_config.json');
var closure = require('../helpers/presenter_helpers.js');

var CardView = View.extend({

  events: {
    'mouseup .back': 'back'
  },

  template: require('../../templates/account_CardTemplate.html'),
  
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  back: function () {
    Backbone.trigger('tasks:goto', '');
  }
  
});

module.exports = CardView;
