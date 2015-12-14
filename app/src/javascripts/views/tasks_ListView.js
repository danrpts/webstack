var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var ItemView = require('./tasks_ItemView.js');
var listPresenter = require('../presenters/tasks_listPresenter.js');
var config = require('../config/tasks_config.js');

var ListView = View.extend({

  template: _.template(require('../../templates/tasks_ListTemplate.html')),

  events: {
    'keyup #input-title': 'onEnter'
  },

  onEnter: function (event) {
    if (event.which === 13) {
      var input = this.$('#input-title');
      this.collection.create({'title': input.val().trim()}, {wait: true});
      input.val('');
      this.render();
    }
  },

  // Bug causing render per model due to add event on collection fetch
  render: function () {

    // Build template
    var helpers = listPresenter(this.collection);
    var $compiled = $(this.template(helpers));

    // When it's the initial render
    if (!this.rendered) {
      this.setElement($compiled);
      this.$el.hide().fadeIn( "slow");
      this.rendered = true;
      (config.debug) && console.log('Initial render list.');
    }

    // When it's a re-render
    else {
      this.$el.html($compiled.html());
      (config.debug) && console.log('Re-render list.');
    }

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
