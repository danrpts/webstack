var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var config = require('../config/account_config.json');
var google = require('../helpers/google_helpers.js');
var closure = require('../helpers/presenter_helpers.js');

var HeaderView = View.extend({

  events: {
    'mouseup #authenticate': 'authenticate',
    'mouseup #profile': 'profile'
  },

  template: require('../../templates/account_HeaderTemplate.html'),

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  authenticate: function () {
    config.debug && console.log('Authenticating...');
    var that = this;
    var set = function (profile) {
      that.model.set({
        'id': profile.getId(),
        'name': profile.getName(),
        'imageUrl': profile.getImageUrl(),
        'email': profile.getEmail()
      });
    }

    // Not happy with this at all
    google.signIn().then(function (user) {
      set(user.getBasicProfile());
    });

  },

  profile: function () {
    Backbone.trigger(config.name + ':goto', 'account/' + this.model.id);
  }

});

module.exports = HeaderView;
