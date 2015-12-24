var Router = require('../routers/account_Router.js');
var CardView = require("../views/account_CardView.js");
var layout = require('../helpers/layout_helpers.js');
var config = require('../config/account_config.json');

var api = {

  card: function () {

    var view = new CardView();

    // Then swap the view into the default region
    view.swap({

      debug: config.debug,

      region: 'header'

    });

  }
  
}

module.exports = {

  start: function () {
    api.card();
  }
  
}
