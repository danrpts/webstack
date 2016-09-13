'use strict';

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/message_sheet.html'),

  initialize: function () {
    this.listenTo(this.model, 'request', this.render);
    this.listenTo(this.model, 'sync', this.render);
  },

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  }

});