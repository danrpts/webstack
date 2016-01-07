var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Controller = require('../classes/Controller.js');
var Item = require('./tasks_item_Controller.js');
var config = require('../config/tasks_config.json');
var codes = require('../config/keycodes_config.json');

var List = module.exports = Controller.extend({

  events: {
    'mouseup .all' : 'all',
    'mouseup .clear' : 'clear',
    'keyup #input-title': 'enter'
  },
  
  // Define the view
  template: require('../../templates/tasks_ListTemplate.html'),

  all: function () {

    // Returns model if found
    var flag = this.collection.find(function (model) {

      // Detect a falsy value
      return !model.get('completed');
    });

    // Set all true if any flag otherwise set all false
    this.collection.each(function (model) {

      // Coax flag into boolean
      model.check(!!flag);

    });

  },

  enter: function (event) {

    if (event.which === codes['ENTER']) {
      var input = this.$('#input-title');
      this.collection.create({'created': Date.now(), 'title': input.val().trim()}, {wait: true});
      input.val('');
      this.render();
    }

  },

  render: function () {

    // List building function
    function list () {
      this.repeat(Item).appendTo(this.$('ul#task-items'));
    }

    // Call the base renderer
    return Controller.prototype.render.call(this, list);

  }

});
