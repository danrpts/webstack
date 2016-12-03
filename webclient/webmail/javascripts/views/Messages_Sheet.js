'use strict';

var $ = require('jquery');

var _ = require('underscore');

var keycodes = require('../config/keycodes.json');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/messages_sheet.html'),

  initialize: function () {

    var search = require('../singletons/search.js');

    // Update the collection when chips are added to the search collection.
    this.listenTo(search, 'update', function (_, options) {

      return this.collection.refresh(search.getValues(), options);
    
    });
  
  },

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  defaultViews: {
    '[data-region="list"]': 'newMessagesList'
  },

  newMessagesList: function () {

    var MessagesList = require('./Messages_List.js');
  
    return new MessagesList({ collection: this.collection });
  
  },

  events: {
    'click #refresh': 'onRefreshClick',
    'keyup #search': 'onSearchKeyup'
  },

  onRefreshClick: function () {

    // Todo: the refresh function should enforce previous query; not this handler
    var $el = $('#search');
    var query = $el.val().trim() || 'in:inbox';
    this.collection.refresh([ query ]);
  },

  onSearchKeyup: function (event) {

    var $el = $(event.currentTarget);
    
    var query = $el.val().trim();
  
    if (keycodes['enter'] === event.which) this.collection.search([ query ]);
  
  }

});
