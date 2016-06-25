'use strict';

var $ = require('jquery');
var _ = require('underscore');
var PageView = require('../views/Page_View.js');
var LinkView = require('../views/AccountLink_View.js');
var CardView = require('../views/AccountCard_View.js');
var page = require('../singletons/page_singleton.js');
var account = require('../singletons/account_singleton.js');

module.exports = function () {

  (!!page)
    && page.remove();

  (page = new PageView())

  .insert($('[data-region="layout"]'))

  .then(function () {

    (new LinkView({ model: account }))

    .insert(page.$('[data-region="header"]'));

    (new CardView({ model: account }))

    .insert(page.$('[data-region="content"]'), {

      wait: account.promise(),
      
      delay: 0

    });

  });

}
