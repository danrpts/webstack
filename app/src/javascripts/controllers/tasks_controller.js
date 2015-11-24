var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('Backbone');
var list = require('../instances/tasks_collection_instance.js');
var ListView = require('../views/tasks_ListView.js');
var CardView = require('../views/tasks_CardView.js');
var ItemModel = require('../models/tasks_ItemModel.js');

// Parent DOM node
var $container = $('#app');
var currentview;

// Private
var fetchAndRenderList = function (listCollection) {
  (!!currentview) && currentview.remove();
  currentview = new ListView({collection: listCollection});
  $container.html(currentview.render());
  listCollection.fetch();
}

var fetchAndRenderCard = function (itemModel) {
  (!!currentview) && currentview.remove();
  currentview = new CardView({model: itemModel});
  $container.html(currentview.render());
  itemModel.fetch();
}

// Public API
module.exports = {

  showListView: function () {
    fetchAndRenderList(list);
  },

  showCardView: function(itemId) {

    // Look for model in local collection
    var cached = list.get(itemId);

    // If model isn't cached, try to make it locally
    if (!cached) {
      cached = list.add({id: itemId});
    }

    // Render view and fetch fresh data
    fetchAndRenderCard(cached);
  }
}
