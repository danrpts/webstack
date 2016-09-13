'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/messages_sheet.html'),

  initialize: function () {
    this.listenTo(this.collection, 'request', this.render);
    this.listenTo(this.collection, 'sync', this.render);
  },

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  events: {
    'click #more': 'onMoreClick'
  },

  onMoreClick: function () {

    this.collection.next();

  }
  
});