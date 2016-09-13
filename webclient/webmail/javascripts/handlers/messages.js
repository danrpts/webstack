'use strict';

var $ = require('jquery');

var MessagesPage = require('../views/Messages_Page.js');

var $region = $('body');

module.exports = function (options) {

  this.authenticate()

  .done(function(account) {

    options = options || {};

    // Do this first so events aren't caught on old view
    if (this.active) this.active.remove();

    var search = require('../singletons/search.js');

    // Check the search bar for state
    var queries = search.getValues();

    // Thought: Maybe trade the account as a token for the messages
    var messages = require('../singletons/messages.js');

    // Only fetch collection in the handler when:
    // 1) It's initially empty (viewed draft directly via url),
    // 2) Or we viewed a message directly via the url
    // Otherwise we may call refresh directly from a click event.
    if (messages.isEmpty() || messages.length < 2) messages.refresh(queries, options);

    // Fetch before view creation so that it misses the request event
    var messagesPage = new MessagesPage({ collection: messages });

    this.active = messagesPage;

    messagesPage.render().$el.appendTo($region);

  })

  .fail(function (account) {

    //console.log("Not signed in...");

    this.to('login');
  
  });

}
