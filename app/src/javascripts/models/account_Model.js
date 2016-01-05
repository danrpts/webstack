var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Model = require('../classes/Model.js');

var AccountModel = Model.extend({

  defaults: {
    'authenticated': false,
    'fullyAuthenticated': false,
    'name': null,
    'imageUrl': null,
    'email': null
  },


  // temporary override
  promise: function () {
    return $.Deferred().resolveWith(this, [this.toJSON()]).promise();
  }

});

module.exports = {

  Model: AccountModel

}
