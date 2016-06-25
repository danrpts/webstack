'use strict';

var _ = require('underscore');
var backbone = require('backbone');
var Model = require('../classes/Model.js');

module.exports = Model.extend({

  defaults: {
    'due': null,
    'completed': null,
    'details': null,
    'created': null
  },

  complete: function (bool) {
    this.save({ 
      'completed': bool ? Date.now() : null
    }, {
      wait: true
    });
  },

  toggleCompletion: function () {
    (!! this.get('completed'))
      ? this.complete(false)
      : this.complete(true);
  },

  validate: function (attributes) {
    if (_.has(attributes, 'title') && attributes.title.length === 0) {
      return "Title cannot be empty.";
    }
  }

});
