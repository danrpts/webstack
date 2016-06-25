'use strict';

var $ = require('jquery');
var _ = require('underscore');
var PageView = require('../views/Page_View.js');
var LinkView = require('../views/AccountLink_View.js');
var ListView = require('../views/TasksList_View.js');
var page = require('../singletons/page_singleton.js');
var account = require('../singletons/account_singleton.js');
var tasks = require('../singletons/tasks_singleton.js');

module.exports = function () {

  (!!page)
    && page.remove();

  (page = new PageView())

  .insert($('[data-region="layout"]'))

  .then(function () {

    (new LinkView({ model: account }))

    .insert(page.$('[data-region="header"]'));

    (new ListView({ collection: tasks }))

    .insert(page.$('[data-region="content"]'), {

      wait: tasks.promise(),
      
      delay: 0

    });

  });

}
