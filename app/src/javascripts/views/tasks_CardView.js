var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View_class.js');
var ItemPresenter = require('../presenters/tasks_ItemPresenter.js');


var CardView = View.extend({

  events: {
    'mouseup #back': 'back'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  template: _.template(require('../../templates/tasks_CardTemplate.html')),

  back: function (event) {
    event.preventDefault();
    Backbone.trigger('router:goto', '');
  },

  render: function () {

    var helpers = new ItemPresenter({model: this.model});
    var $compiled = $(this.template(helpers));
    if (!!this.rendered) {
      this.$el.html($compiled.html());
      console.log('Re-rendering card.');
    } else {
      this.setElement($compiled);
      this.rendered = true;
      console.log('Rendering card.');
    }
    
    return this.$el;
  }
});

module.exports = CardView;
