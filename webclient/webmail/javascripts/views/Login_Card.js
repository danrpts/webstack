'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/login_card.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  events: {
    'click #signin': 'onSigninClick'
  },

  onSigninClick: function () {
    var transition = _.partial(window.transition.to, '');
    this.model.signIn().done(transition);
  }

});