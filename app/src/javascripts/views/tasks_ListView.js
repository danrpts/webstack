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

    // Compile the $el
    this.compile();

    // When it's the initial render
    if (!this.rendered) {
      this.setElement(this.$compiled);
      this.rendered = true;
    }

    // When it's a re-render
    else this.$el.html(this.$compiled.html());

    // Build the list
    var $list = this.$('ul#task-items');
    var $listfragment = $(document.createDocumentFragment());
    this.collection.each(function (itemModel, index) {
      new ItemView({model: itemModel}).render().$el.appendTo($listfragment);
    });
    $listfragment.appendTo($list);

    // Style the $el
    this.style();

    // Compile allows chaining
    return this;

  }

});

module.exports = ListView;
