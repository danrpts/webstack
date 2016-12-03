'use strict';

var $ = require('jquery');

var LoginPage = require('../views/Login_Page.js');

var $region = $('body');

module.exports = function (options) {

  this.authenticate()

  .done(function() {

    //console.log("Signed in...");

    this.to('');

  })

  .fail(function (account) {

    // Do this first so events aren't caught on old view
    if (this.active) this.active.remove();

    var loginPage = new LoginPage({ model: account });

    this.active = loginPage;

    loginPage.render().$el.appendTo($region);
  
  });

}