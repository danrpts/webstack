'use strict';

var $ = require('jquery');

var TaskPage = require('../views/Task_Page.js');

var $region = $('body');

module.exports = function (id, options) {

  this.authenticate().

  done(function(account) {

    // Do this first so events aren't caught on old view
    if (this.active) this.active.remove();

    var tasks = require('../singletons/tasks_singleton.js');

    var task = tasks.lookup(id);

    var taskPage = new TaskPage({ model: task });

    this.active = taskPage;

    taskPage.render().$el.appendTo($region);

  }).

  fail(function (account) {

    console.log("Not signed in...");

    this.to('login');
  
  });

}
