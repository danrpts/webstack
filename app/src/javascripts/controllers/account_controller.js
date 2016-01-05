var Router = require('../routers/account_Router.js');
var HeaderView = require("../views/account_HeaderView.js");
var CardView = require("../views/account_CardView.js");
var account = require('../singletons/account_singleton.js');
var config = require('../config/account_config.json');

var api = {

  showHeader: function () {

    // Create a header view
    var view = new HeaderView({ model: account });

    // Then swap the view into the header region
    view.swap({

      // Inject debug settings
      debug: config.debug,

      // Swap the view into the header region
      region: 'header'

    });

  },

  showCard: function () {

    // Create a card View
    var view = new CardView({ model: account });

    // Then swap the view into the default region
    view.swap({

      // Inject debug settings, temp
      debug: config.debug,

      // Artificial delay
      delay: Math.random() * 500,

      // And show the loader if necessary
      loading: account.promise()

    });

  }
  
}

module.exports = {

  start: function () {

    // Always
    api.showHeader();

    // Start routing
    new Router({ controller: api });
    return this;
  }
  
}
