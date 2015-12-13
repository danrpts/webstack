var Backbone = require('backbone'); // Event system
var layout = require('../helpers/layout_helpers.js');
var list = require('../models/tasks_model.js');
var ListView = require('../views/tasks_ListView.js');
var CardView = require('../views/tasks_CardView.js');

// Router API
var API = {

  list: function () {

    // Create its view
    var view = new ListView({collection: list});

    // Then swap the view into the default region
    layout.swap(view, {

      // And show the loader if necessary
      loading: list.promise(),

      // Artificial delay
      delay: 1000 + Math.random() * 3000

    });

  },

  card: function (itemid) {

    // Check if model is cached
    var item = list.get(itemid);

    // If not build it
    if (!item) item = list.add({id: itemid});

    // Now create its view
    var view = new CardView({model: item});

    // Then swap the view into the default region
    layout.swap(view, {

      // And show loader if necessary
      loading: item.promise()

    });

  }

}

var Router = Backbone.Router.extend({

  routes: {
    '': API.list,
    'tasks/:id': API.card
  },

  initialize: function () {
    this.listenTo(Backbone, 'router:goto', this.goto);
  },

  goto: function (fragment) {
    this.navigate(fragment, {trigger: true});
  }

});

new Router();
