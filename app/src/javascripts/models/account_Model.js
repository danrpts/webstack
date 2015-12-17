var _ = require('underscore');
var Backbone = require('backbone');
var Model = require('../classes/Model.js');


module.exports = {

  Model: Model.extend({

    defaults: {
      'authorized': false
    }

  });

}