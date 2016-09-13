'use strict';

var $ = require('jquery');

var _ = require('underscore');

var ChipsInput = require('./Chips_Input.js');

module.exports = ChipsInput.extend({

  template: require('../../templates/search_input.html')

});
