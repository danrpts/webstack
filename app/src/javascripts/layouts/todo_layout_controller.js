
// Import any basic dependencies
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Layout = require('../classes/Layout.js');

// Import any custom classes
var Router = require('../routers/tasks_Router.js');
var List = require('../controllers/tasks_list_Controller.js');
var Card = require('../controllers/tasks_card_Controller.js');

// Import any data singletons
var tasks = require('../singletons/tasks_singleton.js');

// Import any config objects as JSON
var config = require('../config/tasks_config.json');

var layout;

var controllers = {

  showList: function () {

    // Then swap the view into the default region
    layout.swap({

      controller: new List({ collection: tasks }),

      // Inject debug settings, temp
      debug: config.debug,

      // Artificial delay
      delay: Math.random() * 2000,

      // And show the loader if necessary
      loading: tasks.promise(),

      region: 'content'

    });

  },

  showCard: function (itemid) {

    // Get or create the model
    var item = tasks.add({ id: itemid });

    // Then swap the view into the default region
    layout.swap({

      controller: new Card({ model: item }),

      // Inject debug settings, temp
      debug: config.debug,

      // Artificial delay
      delay: Math.random() * 1000,

      // And show the loader if necessary
      loading: item.promise(),

      region: 'content'

    }); 

  }

}

module.exports = {

  start: function (b) {
    layout = b;
    new Router({ api: controllers });
    return this;
  }
  
}
