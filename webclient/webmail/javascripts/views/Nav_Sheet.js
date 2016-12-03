'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/nav_sheet.html'),

  events: {
    'click #avatar': 'onAvatarClick',
    'click .label': 'onLabelClick'
  },

  // Temporary way to signout and clear global messages
  onAvatarClick: function () {
    var messages = require('../singletons/messages.js');

    // Todo: clean up promise anti-pattern and use a callback directly
    this.model.signOut().then(function () {
      messages.reset();
      window.transition.to('/login');
    });
  },

  // When a navigation link is clicked
  onLabelClick: function (event) {

    var messages = require('../singletons/messages.js');

    // Grab the label
    var label = $(event.currentTarget).text().trim().toLowerCase();
    
    // And trasparently run a search query (unlike the chips style of searching)
    messages.search([ 'in:' + label ]);

  }

});