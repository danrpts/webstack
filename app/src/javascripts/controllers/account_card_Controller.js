'use strict';

var Account_Card_View = require('../views/Account_Card_View.js');

var account = require('../singletons/account_singleton.js');

module.exports = function () {

  account.fetch();

  var account_card_view = new Account_Card_View({ model: account });

  return account_card_view;
  
}