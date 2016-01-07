
// Import any basic dependencies
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Layout = require('../classes/Layout.js');

// Build the Basic layout
var Basic = module.exports = Layout.extend({

  template: require('../../templates/fixed_header_layout_template.html')

});
