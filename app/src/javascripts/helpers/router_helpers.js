'use strict';

var backbone = require('backbone');

module.exports = {
  
  to: function (fragment) {
    if (fragment === '<') window.transition.back();
    else if (fragment === '>') window.transition.forward();
    else backbone.Router.prototype.navigate.call(this, fragment, true);
  },

  back: function () {
    window.history.back();
  },

  forward: function () {
    window.history.forward();
  }

}
