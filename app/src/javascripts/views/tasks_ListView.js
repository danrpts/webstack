var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var listPresenter = require('../presenters/tasks_listPresenter.js');
var ItemView = require('../views/tasks_ItemView.js');

var ListView = Backbone.View.extend({

  template: _.template(require('../../templates/tasks_ListTemplate.html')),

  events: {
    'keyup': 'onEnter'
  },

  initialize: function () {
    this.listenTo(this.collection, 'add', this.render);
  },

  onEnter: function (event) {
    if (event.which === 13) {
      var input = this.$('#input-title');
      this.collection.create({'title': input.val().trim()}, {wait: true});
      input.val('');
    }
  },

  render: function () {

    var helpers = listPresenter(this.collection);
    var $compiled = $(this.template(helpers));

    if (this.rendered) {

      // Re-renders
      this.$el.html($compiled.html());
    } else {

      // Initial render
      this.setElement($compiled);
      this.rendered = true;
    }

    var $listfragment = document.createDocumentFragment();
    this.collection.each(function (itemModel) {
      new ItemView({model: itemModel}).render().appendTo($listfragment);
    });

    var $list = this.$el.find('ul');
    $list.append($listfragment);

    componentHandler.upgradeElements(this.el);
    return this.$el;
  }
});

module.exports = ListView;
