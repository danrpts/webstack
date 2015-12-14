var _ = require('underscore');
var Backbone = require('backbone'); // Event system
var Router = require('../classes/Router.js');
var layout = require('../helpers/layout_helpers.js');
var list = require('../models/tasks_model.js');
var ListView = require('../views/tasks_ListView.js');
var CardView = require('../views/tasks_CardView.js');
var config = require('../config/tasks_config.js');

// Router API
var API = {

  list: function () {

    // Create its view
    var view = new ListView({ collection: list });

    // Then swap the view into the default region
    layout.swap(view, {

      debug: config.debug,

      // And show the loader if necessary
      loading: list.promise(),

      // Artificial delay
      delay: 1000 + Math.random() * 2000

    });

  },

  card: function (itemid) {

    // Check if model is cached
    var item = list.get(itemid);

    // If not build it
    if (!item) item = list.add({id: itemid});

    // Now create its view
    var view = new CardView({ model: item });

    // Then swap the view into the default region
    layout.swap(view, {

      debug: config.debug,

      // And show loader if necessary
      loading: item.promise(),

    });

  }

}

var Router = Router.extend({

  routes: {
    '': API.list,
    'tasks/:id': API.card
  },

  initialize: function () {
    this.listenTo(Backbone, config.name + ':goto', this.goto);
  },

  goto: function (fragment) {
    this.navigate(fragment, {trigger: true});
  }

});

new Router();
