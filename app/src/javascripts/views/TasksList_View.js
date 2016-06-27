'use strict';

var $ = require('jquery');
var View = require('../classes/View.js');
var ItemView = require('./TasksItem_View.js');
var codes = require('../config/keycodes_config.json');

module.exports = View.extend({

  template: require('../../templates/tasks_list_template.html'),

  events: {
    'mouseup #toggleAllCompletion' : 'toggleAllCompletion',
    'keyup #inputTitle' : 'onEnter'
  },

  toggleAllCompletion: function () {

    // Coax into boolean flag
    var flag = !!this.collection.find(function (model) {
      return !model.get('completed');
    });

    // Set all true if any flag otherwise set all false
    this.collection.each(function (model) {
      model.complete(flag);
    });
  },

  onEnter: function (event) {
    if (event.which === codes['ENTER']) {
      this.appendItem();
    }
  },

  appendItem: function (item) {
    var $input = this.$('#inputTitle');
    item = item || this.collection.create({
      'created': Date.now(),
      'title': $input.val().trim()
    },
    { wait: true });
    $input.val('').blur();

    // Ugly MDL workaround
    this.$('.mdl-js-textfield')[0].MaterialTextfield.checkDirty();
    (new ItemView({ model: item }))
    .render().$el.appendTo(this.$('ul#task-items'));
  },

  render: function () {
    return View.prototype.render.call(this, function () {
      var $fragment = $(document.createDocumentFragment());
      this.collection.each(function (item) {
        (new ItemView({ model: item }))
        .render().$el.appendTo($fragment);
      });
      $fragment.appendTo(this.$('ul#task-items'));
    });
  }

});
