
// Import basic dependencies
var _ = require('underscore');
var Backbone = require('backbone');
var Controller = require('./Controller.js');

// Import our custom functions
var helpers = require('../helpers/layout_helpers.js');

// Make sure we have an Object creator
var create = _.isFunction(Object.create) ? Object.create : _.create;

// Export the Layout constructor
var Layout = module.exports = function (options) {

  // Describe the attribute for regions
  this.attribute = 'data-region';

  // Call the super class constructor
  Controller.apply(this, arguments);

}

// Inherit from the Backbone View prototype
Layout.prototype = create(Controller.prototype);

// Inherit our helper functions
_.extend(Layout.prototype, helpers);

// Mix in the extend function
Layout.extend = Controller.extend;
