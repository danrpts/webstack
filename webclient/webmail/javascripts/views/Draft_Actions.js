'use strict';

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/draft_actions.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  }
  
});