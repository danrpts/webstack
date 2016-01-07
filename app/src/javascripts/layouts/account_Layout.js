
// Import any basic dependencies
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Layout = require('../classes/Layout.js');

// Import any custom classes
var Router = require('../routers/account_Router.js');
var Header = require("../controllers/account_header_Controller.js");
var Card = require("../controllers/account_card_Controller.js");

// Import any data singletons
var account = require('../singletons/account_singleton.js');

// Import any config objects as JSON
var config = require('../config/account_config.json');

var controllers = {

  showHeader: function () {

    // Then swap the view into the header region
    this.swap({

      controller: new Header({ model: account });

      // Inject debug settings
      debug: config.debug,

      // Swap the view into the header region
      region: 'header'

    });

  },

  showCard: function () {

    // Then swap the view into the default region
    this.swap({

      controller: new Card({ model: account });

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
    controllers.showHeader();

    // Start routing
    new Router({ api: controllers });
    return this;
  }
  
}
