'use strict';

var $ = require('jquery');

var TasksPage = require('../views/Tasks_Page.js');

var $region = $('body');

module.exports = function (options) {

  this.authenticate()

  .done(function(account) {

    options = options || {};

    // Do this first so events aren't caught on old view
    if (this.active) this.active.remove();

    var tasks = require('../singletons/tasks_singleton.js');

    tasks.fetch();

    var tasksPage = new TasksPage({ collection: tasks });

    this.active = tasksPage;

    tasksPage.render().$el.appendTo($region);

  })

  .fail(function (account) {

    //console.log("Not signed in...");

    this.to('login');
  
  });

}
