'use strict';

var $ = require('jquery');
var backbone = require('backbone');
var Model = require('../classes/Model.js');

module.exports = Model.extend({

  defaults: {
    'name': undefined,
    'image_url': undefined,
    'email': undefined,
    'provider': undefined,
    'fully_signed_in': false
  },

  // Temporary until controllers are depricated and view handles loading by listening to promises
  promise: function () {
    return $.Deferred().resolveWith(this, [this.toJSON()]).promise();
  }

});
