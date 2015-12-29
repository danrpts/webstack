var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var ItemView = require('./tasks_ItemView.js');
var config = require('../config/tasks_config.json');
var codes = require('../config/keycodes_config.json');

var ListView = View.extend({

  events: {
    'mouseup .all' : 'all',
    'mouseup .clear' : 'clear',
    'keyup #input-title': 'enter'
  },
  
  template: require('../../templates/tasks_ListTemplate.html'),

  all: function () {

    // Detect value
    var flag = this.collection.find(function (model) {
      return !!model.get('completed');
    });

    // Iterate and set appropriately
    this.collection.each(function (model) {
      model.check(!flag);
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
      this.repeat(ItemView).appendTo(this.$('ul#task-items'));
    }

    // Call the base renderer
    return View.prototype.render.call(this, list);

  }

});

module.exports = ListView;
