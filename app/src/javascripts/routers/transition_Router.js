'use strict';

var Router = require('../classes/Router.js');
var tasksListController = require('../controllers/tasks_list_controller.js');
var accountCardController = require('../controllers/account_card_controller.js');
var tasksCardController = require('../controllers/tasks_card_controller.js');

module.exports = Router.extend({

  routes: {
    '': tasksListController,
    'account/:id': accountCardController,
    'tasks/:id': tasksCardController
  }

});
