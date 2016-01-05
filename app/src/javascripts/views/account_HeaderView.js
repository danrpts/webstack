var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var config = require('../config/account_config.json');
var google = require('../helpers/google_helpers.js');
var closure = require('../helpers/presenter_helpers.js');

var HeaderView = View.extend({

  events: {
    'mouseup .signIn': 'signIn',
    'mouseup .profile': 'profile'
  },

  template: require('../../templates/account_HeaderTemplate.html'),

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  signIn: function () {
    google.signIn();
  },

  profile: function () {
    Backbone.trigger('goto:' + config.name, 'account/' + this.model.id);
  }

});

module.exports = HeaderView;
