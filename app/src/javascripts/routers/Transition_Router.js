'use strict';

var _ = require('underscore');

var Router = require('../classes/Router.js');

var Index_Root_View = require('../views/Index_Root_View.js');

var index_root_view = new Index_Root_View();

module.exports = Router.extend({

  routes: {
  
    '': _.bind(index_root_view.setTaskPageView, index_root_view),

    'task/:id': _.bind(index_root_view.setTaskPageView, index_root_view),
    
    'account/:id': _.bind(index_root_view.setAccoutPageView, index_root_view)
  
  }

});
