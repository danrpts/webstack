'use strict';

var $ = require('jquery');

var Model = require('../../../architecture/classes/Model.js');

var Collection = require('../../../architecture/classes/Collection.js');

var Radio = Model.extend({

  defaults: {
    'active': false,
    'name': undefined
  },

  // Private helper to toggle state
  _toggleActive: function (options) {
    this.set({ 'active': ! this.get('active') }, options);
  },

  isActive: function () {
    return !! this.get('active');
  },

  getName: function () {
    return this.get('name').toLowerCase();
  }
  
});

module.exports = Collection.extend({

  model: Radio,

  // Helper to toggle inbetween radios
  toggleActive: function (cid) {

    // An invarient exists in that only a single radio is active at a time
    var singleton = this.findWhere({ 'active': true });

    // Note how there may be no active radio initially
    if (!! singleton) 

      // Also, trigger only one change event in this function
      singleton._toggleActive({ 'silent': true });

    // Set the next
    singleton = this.get(cid);

    singleton._toggleActive();

    return singleton;

  }

});
