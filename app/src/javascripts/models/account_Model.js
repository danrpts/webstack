'use strict';

var $ = require('jquery');
var backbone = require('backbone');
var Model = require('../classes/Model.js');

module.exports = Model.extend({

  defaults: {
    'greeting': 'Howdy',
    'name': undefined,
    'image_url': undefined,
    'email': undefined,
    'provider': undefined,
    'fully_signed_in': false
  }

});
