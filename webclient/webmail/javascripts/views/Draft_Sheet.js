'use strict';

var Chips = require('../models/Chips.js');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/draft_sheet.html'),

  initialize: function () {
    this.listenTo(this.model, 'update', this.render);
  },

  prerender: function () {},

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  defaultViews: {
    '#to-chips': 'toChips',
    '#cc-chips': 'ccChips',
    '#bcc-chips': 'bccChips'
  },
  
  toChips: function () {
    var chips = new Chips();
    this.model.set('to', chips);
    var ChipsInput = require('./Chips_Input.js');
    return new ChipsInput({ collection: chips });
  },

  ccChips: function () {
    var chips = new Chips();
    this.model.set('cc', chips);
    var ChipsInput = require('./Chips_Input.js');
    return new ChipsInput({ collection: chips });
  },

  bccChips: function () {
    var chips = new Chips();
    this.model.set('bcc', chips);
    var ChipsInput = require('./Chips_Input.js');
    return new ChipsInput({ collection: chips });
  },

  events: {
    'input #subject': 'onSubjectInput',
    'input #body': 'onBodyInput',
  },

  onSubjectInput: function (event) {
    var $input = this.$(event.currentTarget);
    var value = $input.val().trim();
    if (!! value) {
      this.model.set('subject', value);
    }
  },

  onBodyInput: function (event) {
    var $input = this.$(event.currentTarget);
    var value = $input.val().trim();
    if (!! value) {
      this.model.set('body', value);
    }
  }

});
