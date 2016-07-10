'use strict';

var Account_Link_View = require('../views/Account_Link_View.js');

var account = require('../singletons/account_singleton.js');

module.exports = function () {

  account.fetch();

  var account_link_view = new Account_Link_View({ model: account });

  return account_link_view;
  
}