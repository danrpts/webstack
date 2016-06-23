'use strict';

var $ = require('jquery');
var _ = require('underscore');
var PageView = require('../views/default_page_View.js');
var LinkView = require('../views/account_link_View.js');
var CardView = require('../views/account_card_View.js');
var account = require('../singletons/account_singleton.js');
var page = require('../singletons/page_singleton.js');

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
