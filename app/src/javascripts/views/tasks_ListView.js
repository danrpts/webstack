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

  presenter: require('../presenters/tasks_listPresenter.js'),

  template: _.template(require('../../templates/tasks_ListTemplate.html')),

  onEnter: function (event) {
    if (event.which === 13) {
      var input = this.$('#input-title');
      this.collection.create({'title': input.val().trim()}, {wait: true});
      input.val('');
      this.render();
    }
  },

  render: function () {

    // Build template
    var helpers = _.isFunction(this.presenter) ? this.presenter(this.collection) : this.collection.toJSON();
    var $compiled = _.isFunction(this.template) ? $(this.template(helpers)) : $(template);
    this.prepare($compiled);

    var $list = this.$('ul');
    var $listfragment = $(document.createDocumentFragment());
    this.collection.each(function (itemModel, index) {
      new ItemView({model: itemModel}).render().appendTo($listfragment);
    });
    $listfragment.appendTo($list);

    // MDL
    componentHandler.upgradeElements(this.el);

    // Returning $el instead
    return this.$el;
  }
});

module.exports = ListView;
