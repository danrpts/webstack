'use strict';

var $ = require('jquery');

var Draft = require('../models/Google_Draft.js');

var DraftPage = require('../views/Draft_Page.js');

var $region = $('body');

module.exports = function (id, options) {

  this.authenticate()

  .done(function(account) {

    // Do this first so events aren't caught on old view
    if (this.active) this.active.remove();

    var draft = new Draft();

    var draftPage = new DraftPage({ model: draft });

    this.active = draftPage;

    draftPage.render().$el.appendTo($region);

  })

  .fail(function (account) {

    //console.log("Not signed in...");

    this.to('login');
  
  });

}
