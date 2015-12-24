var Router = require('../routers/tasks_Router.js');
var ListView = require('../views/tasks_ListView.js');
var CardView = require('../views/tasks_CardView.js');
var list = require('../entities/tasks_entity.js');
var config = require('../config/tasks_config.json');

var api = {

  list: function () {

    // Create its view
    var view = new ListView({ collection: list });

    // Then swap the view into the default region
    view.swap({

      // Inject debug settings, temp
      debug: config.debug,

      // Artificial delay
      delay: Math.random() * 2000,

      // And show the loader if necessary
      loading: list.promise()

    });

  },

  card: function (itemid) {

    // Get or create the model
    var item = list.add({ id: itemid });

    // Create its view with model
    var view = new CardView({ model: item });

    // Then swap the view into the default region
    view.swap({

      // Inject debug settings, temp
      debug: config.debug,

      // Artificial delay
      delay: Math.random() * 1000,

      // And show the loader if necessary
      loading: item.promise()

    }); 

  }

}

module.exports = {

  start: function () {
    new Router({ controller: api });
    return this;
  }
  
}
