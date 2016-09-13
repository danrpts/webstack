'use strict';

var $ = require('jquery');

var _ = require('underscore');

var Router = require('../../../architecture/classes/Router.js');

module.exports = Router.extend({

  routes: {
    '':            require('../handlers/tasks_handler.js'),
    'tasks/:id':   require('../handlers/task_handler.js'),
    'account/:id': require('../handlers/account_handler.js'),
    'login':       require('../handlers/login_handler.js')
  },

  authenticate: function () {

    var router = this;

    var deferred = $.Deferred();

    var account = require('../singletons/account_singleton.js');

    account.fetch().

    done(function () {

      if (account.isSignedIn())

        deferred.resolveWith(router, [account]);

      else

        deferred.rejectWith(router, [account]);

    });

    return deferred;
  
  }

});
