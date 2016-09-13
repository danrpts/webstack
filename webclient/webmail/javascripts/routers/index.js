'use strict';

var $ = require('jquery');

var _ = require('underscore');

var Router = require('../../../architecture/classes/Router.js');

module.exports = Router.extend({

  routes: {
    '':             require('../handlers/messages.js'),
    'messages/:id': require('../handlers/message.js'),
    'drafts(/:id)': require('../handlers/draft.js'),
    'login':        require('../handlers/login.js')
  },

  authenticate: function () {

    var router = this;

    var deferred = $.Deferred();

    var account = require('../singletons/account.js');

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
