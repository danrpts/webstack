'use strict';

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/messages_actions.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  }

});