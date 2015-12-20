var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var ItemView = require('./tasks_ItemView.js');
var config = require('../config/tasks_config.js');

var ListView = View.extend({

  events: {
    'keyup #input-title': 'onEnter'
  },
  
  template: require('../../templates/tasks_ListTemplate.html'),

  presenter: require('../presenters/tasks_listPresenter.js'),

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
      var $list = this.$('ul#task-items');
      var $listfragment = $(document.createDocumentFragment());
      this.collection.each(function (itemModel, index) {
        new ItemView({model: itemModel}).render().$el.appendTo($listfragment);
      });
      $listfragment.appendTo($list);
    }

    // Call the base renderer
    return View.prototype.render.call(this, list);

  }

});

module.exports = ListView;
