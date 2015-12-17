var Router = require('../routers/tasks_Router.js');
var ListView = require('../views/tasks_ListView.js');
var CardView = require('../views/tasks_CardView.js');
var list = require('../entities/tasks_entity.js');
var layout = require('../helpers/layout_helpers.js');
var config = require('../config/tasks_config.js');

var api = {

  list: function () {

    // Create its view
    var view = new ListView({ collection: list.entity });

    // Then swap the view into the default region
    layout.swap(view, {

      debug: config.debug,

      // And show the loader if necessary
      loading: list.entity.promise(),

      // Artificial delay
      //delay: Math.random() * 2000

    });

  },

  card: function (itemid) {

    var item = list.entity.get(itemid);

    if (!item) item = list.entity.add({id: itemid});

    var view = new CardView({ model: item });

    // Then swap the view into the default region
    layout.swap(view, {

      debug: config.debug,

      // And show the loader if necessary
      loading: item.promise(),

      // Artificial delay
      //delay: Math.random() * 200

    }); 

  }

}

module.exports = {

  start: function () {
    new Router({ controller: api });
  }
  
}

