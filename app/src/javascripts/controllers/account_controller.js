var Router = require('../routers/account_Router.js');
var CardView = require("../views/account_CardView.js");
var layout = require('../helpers/layout_helpers.js');
var config = require('../config/account_config.js');

var api = {

  card: function () {

    var view = new CardView();

    // Then swap the view into the default region
    layout.swap(view, {

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
