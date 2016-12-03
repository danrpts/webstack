'use strict';

var _ = require('underscore');

var backbone = require('backbone');

module.exports = {
  
  to: function (fragment, options) {
    options = options || {};
    _.defaults(options, {
      trigger: true
    }) 
    fragment = fragment || '';
    if (fragment === '<') this.back();
    else if (fragment === '>') this.forward();
    else backbone.Router.prototype.navigate.call(this, fragment, options);
  },

  back: function () {
    window.history.back();
  },

  forward: function () {
    window.history.forward();
  }

}
