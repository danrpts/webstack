var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var config = require('../config/tasks_config.js');

var CardView = View.extend({

  template: require('../../templates/account_CardTemplate.html')

});

module.exports = CardView;
