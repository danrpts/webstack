'use strict';

var _ = require('underscore');

var Model = require('../../../architecture/classes/Model.js');

module.exports = Model.extend({

  defaults: {
    'due': null,
    'completed': null,
    'details': null,
    'created': null
  },

  complete: function (bool) {
    this.save({
      completed : bool ? Date.now() : null
    });
  },

  toggleCompletion: function () {
    !!this.get('completed')
      ? this.complete(false)
      : this.complete(true);
  },

  validate: function (attributes) {
    if (_.has(attributes, 'title') && attributes.title.length === 0) {
      return "Title cannot be empty.";
    }
  },

  format: function (key) {
    var timestamp = new Date(this.get(key));
    var today = new Date();
    var time = key + ' @ ' + timestamp.toLocaleTimeString();
    var date = key + ' on ' + timestamp.toDateString();
    return (timestamp.getDay() === today.getDay()) ? time : date;
  }

});
