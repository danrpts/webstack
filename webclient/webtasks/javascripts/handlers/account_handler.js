'use strict';

var $ = require('jquery');

var AccountPage = require('../views/Account_Page.js');

var $region = $('body');

module.exports = function (options) {

  this.authenticate()

  .done(function(account) {

    options = options || {};

    // Do this first so events aren't caught on old view
    if (this.active) this.active.remove();

    var account = require('../singletons/account_singleton.js');

    // Fetch before view creation so that it misses the request event
    var accountPage = new AccountPage({ model: account });

    this.active = accountPage;

    accountPage.render().$el.appendTo($region);

  })

  .fail(function (account) {

    //console.log("Not signed in...");

    this.to('login');
  
  });

}
