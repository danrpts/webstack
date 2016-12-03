'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

var keycodes = require('../config/keycodes.json');

module.exports = View.extend({

  template: require('../../templates/compose_sheet.html'),

  defaultViews: {
    '[data-region="to-input"]': 'newToInput'
  },

  newToInput: function () {
    var Chips = require('../models/Chips.js');
    var ChipsInput = require('./Chips_Input.js');
    var chips = new Chips();
    this.model.set('to', chips);
    return new ChipsInput({ collection: chips });
  },

  events: {
    'click #close': 'onCloseClick',
    'click #save': 'onSaveClick',
    'click #send': 'onSendClick',
    'blur #chips-input': 'onChipsInputBlur',
    'keyup #subject': 'onSubjectInputKeyup',
    'keyup #body': 'onBodyInputKeyup'
  },

  // Trigger an enter event on chips input blur
  onChipsInputBlur: function (event) {
    var e = $.Event("keydown");
    e.which = keycodes.enter;
    this.$(event.currentTarget).trigger(e);
  },

  // Update the subject attribute every keyup
  onSubjectInputKeyup: function (event) {
    var $input = this.$(event.currentTarget);
    var value = $input.val().trim();
    this.model.set('subject', value);
  },

  // Update the to attribute every keyup
  onBodyInputKeyup: function (event) {
    var $input = this.$(event.currentTarget);
    var value = $input.val().trim();
    this.model.set('body', value);
  },

  // Todo
  onCloseClick: function () {

    // Prompt save before close?

    return true;
  },

  onSaveClick: function () {

    // First save draft to localstorage
    // ...
    
    // Then to save the message remotely
    this.model.save(function (result) {

      // if error handle it
      // ...

      // else delete the localstorage draft
      // ...

    });

    // Immediately close for perc. perf.
    this.$('#close').click();

  },

  onSendClick: function () {
    
    // first save draft
    //...
    //var backup = this.model.toJSON();

    // send the message
    this.model.send(function (result) {

      // if error handle it
      // ...

      // else delete draft
      //this.destroy();

    });

    // Immediately close for perc. perf.
    this.$('#close').click();

  }

});
