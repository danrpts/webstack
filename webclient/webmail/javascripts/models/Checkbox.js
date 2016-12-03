'use strict';

var $ = require('jquery');

var Model = require('../../../architecture/classes/Model.js');

var Collection = require('../../../architecture/classes/Collection.js');

module.exports = Model.extend({

  defaults: {
    'checked': false,
  },

  toggleChecked: function () {
    var value = ! this.get('checked');
    this.set({ checked: value });
    return value;
  },

  isChecked: function () {
    return !! this.get('checked');
  },

  setChecked: function (value, options) {
    this.set('checked', !! value, options);
  }
  
});
