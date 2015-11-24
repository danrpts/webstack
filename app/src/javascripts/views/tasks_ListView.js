var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var ListPresenter = require('../presenters/tasks_ListPresenter.js');
var ItemView = require('../views/tasks_ItemView.js');

var ListView = Backbone.View.extend({

  template: _.template(require('../../templates/tasks_ListTemplate.html')),

  events: {
    'keyup #input': 'enter'
  },

  initialize: function () {
    this.listenTo(this.collection, 'add', this.render);
  },

  enter: function (event) {
    if (event.which === 13) {
      var input = this.$('#input');
      this.collection.create({'text': input.val().trim()}, {wait: true});
      input.val('');
    }
  },

  render: function () {

    var helpers = new ListPresenter({collection: this.collection});
    var $compiled = $(this.template(helpers));
    if (!!this.rendered) {
      this.$el.html($compiled.html());
      console.log('Re-rendering list.');
    } else {
      this.setElement($compiled);
      this.rendered = true;
      console.log('Initial list render.');
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
