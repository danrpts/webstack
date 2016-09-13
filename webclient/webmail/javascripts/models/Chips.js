'use strict';

var $ = require('jquery');

var Model = require('../../../architecture/classes/Model.js');

var Collection = require('../../../architecture/classes/Collection.js');

var Chip = Model.extend({

  defaults: {
    'value': undefined,
  },

  getValue: function () {
    return this.get('value');
  }
  
});

module.exports = Collection.extend({

  model: Chip,

  getValues: function () {
    return this.invoke('getValue');
  }
  
});
