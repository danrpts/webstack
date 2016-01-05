var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var google = require('../helpers/google_helpers.js');
var closure = require('../helpers/presenter_helpers.js');

var CardView = View.extend({

  events: {
    'mouseup .back': 'back',
    'mouseup .signout': 'signout'
  },

  template: require('../../templates/account_CardTemplate.html'),
  
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  back: function () {
    Backbone.trigger('goto:tasks', '');
  },

  signout: function () {
    var that = this;
    google.signOut().then(function () {
      that.back(); 
    });
  }
  
});

module.exports = CardView;
