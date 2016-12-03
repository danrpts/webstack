'use strict';

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/label_tabs.html'),

  initialize: function () {
    
    // Re-render when the search bar updates itself or when tabs are clicked
    var search = require('../singletons/search.js');
    this.listenTo(search, 'change', this.render);

    this.listenTo(this.collection, 'sync', this.render);
  },

  events: {
    'click .mdl-tabs__tab': 'onLabelClick'
  },

  onLabelClick: function (event) {
    var active = this.collection.toggleActive(event.currentTarget.id);
    var search = require('../singletons/search.js');
    search.reset();
    search.add({ 'value': 'in:' + active.getName() });
  }

});
