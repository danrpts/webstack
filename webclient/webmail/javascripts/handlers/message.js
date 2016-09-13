'use strict';

var $ = require('jquery');

var MessagePage = require('../views/Message_Page.js');

var $region = $('body');

module.exports = function (id, options) {

  this.authenticate().

  done(function(account) {

    // Do this first so events aren't caught on old view
    if (this.active) this.active.remove();

    // maybe trade the account as a token for the messages
    var messages = require('../singletons/messages.js');

    var message = messages.lookup(id);

    var messagePage = new MessagePage({ model: message });

    this.active = messagePage;

    messagePage.render().$el.appendTo($region);

  }).

  fail(function (account) {

    console.log("Not signed in...");

    this.to('login');
  
  });

}
