var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var ItemView = require('./tasks_ItemView.js');
var EmptyView = require('./tasks_EmptyView.js');
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

    this.compile();

    var $list = this.$('ul#task-items').empty();
    var $listfragment = $(document.createDocumentFragment());

    this.collection.each(function (itemModel, index) {
      new ItemView({model: itemModel}).render().appendTo($listfragment);
    });

    $listfragment.appendTo($list);

    return this.$el;

  }

});

module.exports = ListView;
