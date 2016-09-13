'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/tool_bar.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },
  
  defaultViews: {
    '#search': 'searchChips'
  },

  searchChips: function () {
    var search = require('../singletons/search.js');
    var SearchInput = require('./Search_Input.js');
    return new SearchInput({ collection: search });
  },

  //filterChipsView: function () {
  //  var filter = require('../singletons/filter.js');
  //  var FilterChips = require('./Chips_Input.js');
  //  return new FilterChips({ collection: filter });
  //},

  events: {
    'click #avatar': 'onAvatarClick'
  },

  onAvatarClick: function () {
    var messages = require('../singletons/messages.js');
    messages.reset();
    var transition = _.partial(window.transition.to, 'login');
    this.model.signOut().done(transition);
  }
  
});
