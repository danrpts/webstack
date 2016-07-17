'use strict';

var _ = require('underscore');

var View = require('../classes/View.js');

var account_link_handler = require('../handlers/account_link_handler.js');
var account_card_handler = require('../handlers/account_card_handler.js');

module.exports = View.extend({

  template: require('../../templates/scroll_header_transparent_template.html'),
  
  defaultViews: {
    '[data-region="header"]': account_link_handler
  },

  setAccountCardView: function () {
    
    var account_card_view = account_card_handler();
    
    this.setViews(account_card_view, '[data-region="content"]');

  },

  postrender: function () {
    
    componentHandler.upgradeElements(this.el);
  
  }

});
