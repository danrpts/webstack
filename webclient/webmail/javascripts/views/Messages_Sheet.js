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
    '[data-region="search-input"]': 'newSearchInput',
    '[data-region="messages-list"]': 'newMessagesList'
  },

  newSearchInput: function () {

    // Notice search is a chips type collection
    var search = require('../singletons/search.js');

    var SearchInput = require('./Search_Input.js');
    
    return new SearchInput({ collection: search });

  },

  newMessagesList: function () {

    var MessagesList = require('./Messages_List.js');
  
    return new MessagesList({ collection: this.collection });
  
  },

  events: {
    'click #more': 'onMoreClick',
    'keyup #search': 'onSearchKeyup'
  },

  onSearchKeyup: function (event) {

    var $el = $(event.currentTarget);
    
    var query = $el.val().trim();
  
    if (keycodes['enter'] === event.which) this.collection.search([ query ]);
  
  }

});
