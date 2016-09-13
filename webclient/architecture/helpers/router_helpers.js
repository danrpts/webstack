'use strict';

var backbone = require('backbone');

module.exports = {
  
  to: function (fragment) {
    fragment = fragment || '';
    if (fragment === '<') this.back();
    else if (fragment === '>') this.forward();
    else backbone.Router.prototype.navigate.call(this, fragment, true);
  },

  back: function () {
    window.history.back();
  },

  forward: function () {
    window.history.forward();
  }

}
