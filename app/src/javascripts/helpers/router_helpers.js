'use strict';

var backbone = require('backbone');

module.exports = {
  
  to: function (fragment) {
    backbone.Router.prototype.navigate.call(this, fragment, true);
  },

  back: function () {
    window.history.back();
  },

  forward: function () {
    window.history.forward();
  }

}