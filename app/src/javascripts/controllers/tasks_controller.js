var ListView = require('../views/tasks_ListView.js');
var CardView = require('../views/tasks_CardView.js');
var list = require('../entities/tasks_entity.js');
var layout = require('../helpers/layout_helpers.js');
var config = require('../config/tasks_config.js');

module.exports = {

  card: function (itemid) {

    // Check if model is cached
    var item = list.entity.get(itemid);

    // If not build it
    if (!item) item = list.entity.add({id: itemid});

    // Now create its view
    var view = new CardView({ model: item });

    // Then swap the view into the default region
    layout.swap(view, {

      debug: config.debug,

      // And show loader if necessary
      loading: item.promise(),

    });
    
  },

  list: function () {

    // Create its view
    var view = new ListView({ collection: list.entity });

    // Then swap the view into the default region
    layout.swap(view, {

      debug: config.debug,

      // And show the loader if necessary
      loading: list.entity.promise(),

      // Artificial delay
      delay: 1000 + Math.random() * 2000

    });

  }

}
