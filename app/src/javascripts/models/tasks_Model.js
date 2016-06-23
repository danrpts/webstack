'use strict';

var backbone = require('backbone');
var Model = require('../classes/Model.js');

module.exports = Model.extend({

  defaults: {
    'due': null,
    'completed': null,
    'details': null,
    'created': null
  },

  check: function (bool) {

    var options = { wait: true }

    this.save({ 'completed': bool ? Date.now() : null }, options);

  },

  toggle: function () {

    !this.get('completed') ? this.check(true) : this.check(false);

  },

  validate: function (attributes) {

    if ('title' in attributes && attributes.title.length === 0) {
      return "Title cannot be empty.";
    }
    
  }

});
