'use strict';

var $ = require('jquery');

var _ = require('underscore');

var ChipsInput = require('./Chips_Input.js');

module.exports = ChipsInput.extend({

  template: require('../../templates/search_input.html'),
  
  events: {
    'keydown #chips-input': 'onInputKeydown'
  },

  onInputEnter: function (event) {
    var $input = this.$(event.currentTarget);
    var value = $input.val().trim();
    var collection = this.collection;
    var attributes = { value: value };
    if (!!value && !collection.findWhere(attributes)) {
      collection.push(attributes);
      $input.val('');
    }
  },

  onInputBackspace: function (event) {
    var $input = this.$(event.currentTarget);
    var value = $input.val();
    if (!value) this.collection.pop();
  },

  onInputKeydown: function (event) {
    switch (event.which) {
      case keycodes['backspace']: this.onInputBackspace.apply(this, arguments); break;
      case keycodes['enter']: this.onInputEnter.apply(this, arguments); break;
    }
  }

});
