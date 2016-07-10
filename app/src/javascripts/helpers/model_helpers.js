'use strict';

var backbone = require('backbone');
module.exports = {

  sync: function () {
    return this.promise = backbone.Model.prototype.sync.apply(this, arguments);
  }
  
}
