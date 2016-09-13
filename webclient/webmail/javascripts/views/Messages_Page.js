'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/messages_page.html'),

  initialize: function () {
    var search = require('../singletons/search.js');

    // Update the collection when chips are added to the search collection.
    this.listenTo(search, 'update', function (_, options) {
      return this.collection.refresh(search.getValues(), options);
    });
  
  },

  prerender: function () {},

  postrender: function () {},

  defaultViews: {
    'header': 'toolBar',
    'main': 'messagesSheet',
    'footer': 'messagesActions'
  },

  toolBar: function () {
    var account = require('../singletons/account.js');
    var ToolBar = require('./Tool_Bar.js');
    return new ToolBar({ model: account });
  },

  messagesSheet: function () {
    var MessagesSheet = require('./Messages_Sheet.js');
    return new MessagesSheet({ collection: this.collection });
  },

  messagesActions: function () {
    var MessagesActions = require('./Messages_Actions.js');
    return new MessagesActions({ collection: this.collection });
  },

  events: {
    'click #title': 'onTitleClick'
  },

  onTitleClick: function (event) {

    var search = require('../singletons/search.js');

    event.preventDefault();

    this.collection.refresh(search.getValues());

  }

});
