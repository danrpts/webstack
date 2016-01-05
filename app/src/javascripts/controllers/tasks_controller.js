var Router = require('../routers/tasks_Router.js');
var ListView = require('../views/tasks_ListView.js');
var CardView = require('../views/tasks_CardView.js');
var tasks = require('../singletons/tasks_singleton.js');
var config = require('../config/tasks_config.json');

var api = {

  showList: function () {

    // Create its view
    var view = new ListView({ collection: tasks });

    // Then swap the view into the default region
    view.swap({

      // Inject debug settings, temp
      debug: config.debug,

      // Artificial delay
      delay: Math.random() * 2000,

      // And show the loader if necessary
      loading: tasks.promise()

    });

  },

  showCard: function (itemid) {

    // Get or create the model
    var item = tasks.add({ id: itemid });

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
