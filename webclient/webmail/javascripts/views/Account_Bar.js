'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/account_bar.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  }

});
