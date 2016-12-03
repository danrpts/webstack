'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/messages_list.html'),

  initialize: function () {

    // Created own events because the google messages api requires two ajax calls
    this.listenTo(this.collection, 'batch:request', this.render);
    this.listenTo(this.collection, 'batch:sync', this.render);

    // Trigger re redner for things such as removes, merges, etc...
    this.listenTo(this.collection, 'change update', this.render);
  },

  postrender: function () {
    
    console.log("Rendering messages list of size %i and is pending %s", this.collection.length, this.collection.isPending());
    
    componentHandler.upgradeElements(this.el);
    
  },

  events: {
    'click #more': 'onMoreClick'
  },

  // Fire first then ignore button mash for one second
  onMoreClick: _.debounce(function () {
    this.collection.more();
  }, 1000, true)

});
