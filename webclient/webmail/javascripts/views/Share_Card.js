'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/share_card.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  defaultViews: {
    '#share-input': 'shareChips'
  },

  shareChips: function () {
    var Chips = require('../models/Chips.js');
    var ShareInput = require('./Share_Input.js');
    var chips = new Chips();
    return new ShareInput({ collection: chips });
  },

  events: {
    'click #share-send': 'onSendClick'
  },

  onSendClick: function () {

  }

});