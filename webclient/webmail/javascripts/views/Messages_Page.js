'use strict';

var $ = require('jquery');

require('jquery-ui-browserify');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/messages_page.html'),

  postrender: function () {

    // Only when there is a message to display, shall we
    if (!! this.model) {
      this.showMessageSheet();
    }

    componentHandler.upgradeElements(this.el);

  },

  defaultViews: {
    '[data-region="drawer"]': 'navSheet',
    '[data-region="content"]': 'messagesSheet'
  },

  navSheet: function () {
    var account = require('../singletons/account.js');
    var NavSheet = require('./Nav_Sheet.js');
    return new NavSheet({ model: account });
  },

  searchInput: function () {
    var search = require('../singletons/search.js');
    var SearchInput = require('./Search_Input.js');
    return new SearchInput({ collection: search });
  },

  messagesSheet: function () {
    var messages = require('../singletons/messages.js');
    var MessagesSheet = require('./Messages_Sheet.js');
    return new MessagesSheet({ collection: messages });
  },

  messageSheet: function () {
    var MessageSheet = require('./Message_Sheet.js');
    return new MessageSheet({ model: this.model });
  },

  composeSheet: function () {
    var ComposeSheet = require('./Compose_Sheet.js');
    return new ComposeSheet({ model: this.model });
  },

  events: {
    'click #compose': 'onComposeClick',
    'click [href^="/messages"]': 'onHrefMessageClick',
    'click #close': 'onCloseSecondaryClick',
    'click #trash': 'onTrashMessageClick'
  },

  hideSecondarySheet: function () {
    var $el = this.$('.resizable');
    $el.hide();
  },

  showComposeSheet: function () {
    var $el = this.$('.resizable');
    $el.resizable({
      handles: { 
        w : '.ui-resizable-w'
      }
    });
    this.setView(this.composeSheet(), '[data-region="secondary"]');
    $el.show();
  },

  showMessageSheet: function () {
    var $el = this.$('.resizable');
    $el.resizable({
      handles: { 
        w : '.ui-resizable-w'
      }
    });
    this.setView(this.messageSheet(), '[data-region="secondary"]');
    $el.show();
  },

  showNextMessageSheet: function () {
    var previous = this.model;
    var messages = require('../singletons/messages.js');
    var index = messages.indexOf(previous);
    console.log(index);
    if (index > -1) {
      this.model = messages.at(index+1);
    }
    else {
      this.model = messages.first();
    }
    this.showMessageSheet();
    return previous;
  },

  onComposeClick: function () {
    var GoogleMessage = require('../models/Google_Message.js');
    this.model = new GoogleMessage();
    this.showComposeSheet();
  },

  // Intercept href single clicks coming from the message sheet
  onHrefMessageClick: function(event) {
    event.preventDefault();
    event.stopPropagation();
    var href = $(event.currentTarget).attr('href')
    var fragment = href.replace(/^\//, '').replace('\#\!\/', '');
    var id = fragment.replace('messages\/', '');
    var messages = require('../singletons/messages.js');
    this.model = messages.lookup(id);
    this.showMessageSheet();
    //window.transition.to(fragment, { trigger: false });
    return false;
  },

  // Notice how we handle the secondary close event within context of the messages page
  onCloseSecondaryClick: function () {

    // So that we can do view composition here,
    this.model = undefined;

    // Update the url (do not navigate)
    //window.transition.to('', { trigger: false });

    // And simply hide the secondary sheet instead of re-redering the whole page
    this.hideSecondarySheet();

    // Allow propogation
    return true;
  },

  onTrashMessageClick: function () {

    // Immediately show the next message
    var previous = this.showNextMessageSheet();

    // Update the url (do not navigate)
    window.transition.to('', { trigger: false });

    // Then trash the previous model
    previous.trash();

    // Allow propogation
    return true;
  }

});
