var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var ItemView = require('./tasks_ItemView.js');
var config = require('../config/tasks_config.json');

var ListView = View.extend({

  events: {
    'keyup #input-title': 'onEnter'
  },
  
  template: require('../../templates/tasks_ListTemplate.html'),

  onEnter: function (event) {

    if (event.which === 13) {
      var input = this.$('#input-title');
      this.collection.create({'title': input.val().trim()}, {wait: true});
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
