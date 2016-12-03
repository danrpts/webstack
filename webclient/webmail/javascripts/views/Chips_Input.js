'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

var keycodes = require('../config/keycodes.json');

// Notice ChipsList is a private child view
var ChipsList = View.extend({

  template: require('../../templates/chips_list.html'),

  initialize: function () {
    this.listenTo(this.collection, 'update', this.render);
  },

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  events: {
    'click .chip-delete': 'onDeleteClick'
  },

  onDeleteClick: function (event) {
    var cid = event.currentTarget.id;
    this.collection.remove(cid);
  }

});

module.exports = View.extend({

  template: require('../../templates/chips_input.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  defaultViews: {
    '#chips-list': 'newChipsList'
  },
  
  newChipsList: function () {
    return new ChipsList({ collection: this.collection });
  },

  events: {
    'keydown #chips-input': 'onInputKeydown'
  },

  // Todo: fetch data list items and find select event
  onInputSelect: function (event) {},

  onInputEnter: function (event) {
    var $input = this.$(event.currentTarget);
    var value = $input.val().trim();
    var collection = this.collection;
    var attributes = { value: value };
    if (!!value && !collection.findWhere(attributes)) {
      collection.push(attributes);
      $input.val('');
    }
  },

  onInputBackspace: function (event) {
    var $input = this.$(event.currentTarget);
    var value = $input.val();
    if (!value) this.collection.pop();
  },

  onInputKeydown: function (event) {
    switch (event.which) {
      case keycodes['backspace']: this.onInputBackspace.apply(this, arguments); break;
      case keycodes['enter']: this.onInputEnter.apply(this, arguments); break;
    }
  }

});
