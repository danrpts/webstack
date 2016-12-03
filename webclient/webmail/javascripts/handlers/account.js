'use strict';

var $ = require('jquery');

var AccountPage = require('../views/Account_Page.js');

var $region = $('body');

module.exports = function (id, options) {

  this.authenticate()

  .done(function(account) {

    options = options || {};

    // Do this first so events aren't caught on old view
    if (this.active) this.active.remove();

    var account = require('../singletons/account.js');

    account.fetch(id);

    var accountPage = new AccountPage({ model: account });

    this.active = accountPage;

    accountPage.render().$el.appendTo($region);

  })

  .fail(function (account) {

    //console.log("Not signed in...");

    this.to('login');
  
  });

}
