'use strict';

var _ = require('underscore');

var View = require('../classes/View.js');

var task_page_handler = require('../handlers/task_page_handler.js');

var account_page_handler = require('../handlers/account_page_handler.js');

module.exports = View.extend({

  el: 'body',

  setTaskPageView: function (id) {

    var task_page_view = task_page_handler();
    
    this.setViews(task_page_view, '[data-region="application"]');
    
    !! id
      ? task_page_view.setTaskCardView(id)
      : task_page_view.setTaskListView();
  
  },

  setAccoutPageView: function () {

    var account_page_view = account_page_handler();
    
    this.setViews(account_page_view, '[data-region="application"]');
    
    account_page_view.setAccountCardView();
  
  }

});
