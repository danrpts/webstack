(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('../helpers/model_helpers.js');

var Collection = function (models, options) {
  Backbone.Collection.apply(this, arguments);
}

Collection.prototype = Object.create(Backbone.Collection.prototype);

_.extend(Collection.prototype, helpers, {

  // TODO: integrate with controllers
  // REF: https://youtu.be/P0YIdsJqKV4
  // BUG: fetch returns attributes, must use callback?
  lookup: function (id) {
    var model;

    // Find model in local collection
    if (model = this.get(id)) {

      // Return as a resolved promise
      model = $.Deferred().resolveWith(this, [model]);

    }

    // Try to find cached model in local storage
    else {

      // First create an instance
      model = this.add({id: id});

    }

    // Then return as a promise
    return model.promise();

  }

});

Collection.extend = Backbone.Collection.extend;

module.exports = Collection;

},{"../helpers/model_helpers.js":11,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],2:[function(require,module,exports){
var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('../helpers/model_helpers.js');

var Model = function (attributes, options) {
  Backbone.Model.call(this, attributes, options);
}

Model.prototype = Object.create(Backbone.Model.prototype);

_.extend(Model.prototype, helpers);

Model.extend = Backbone.Model.extend;

module.exports = Model;

},{"../helpers/model_helpers.js":11,"backbone":"backbone","underscore":"underscore"}],3:[function(require,module,exports){
var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('../helpers/router_helpers.js');

var Router = function (options) {
  options = options || {};
  options['controller'] && _.extend(this, _.pick(options.controller, _.functions(options.controller)));
  Backbone.Router.call(this, options);
}

Router.prototype = Object.create(Backbone.Router.prototype);

_.extend(Router.prototype, helpers);

Router.extend = Backbone.Router.extend;

module.exports = Router;

},{"../helpers/router_helpers.js":12,"backbone":"backbone","underscore":"underscore"}],4:[function(require,module,exports){
var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('../helpers/view_helpers.js');

var View = function (options) {
  Backbone.View.call(this, options);
}

View.prototype = Object.create(Backbone.View.prototype);

_.extend(View.prototype, helpers);

View.extend = Backbone.View.extend;

module.exports = View;

},{"../helpers/view_helpers.js":13,"backbone":"backbone","underscore":"underscore"}],5:[function(require,module,exports){
module.exports = {
  name: 'account',
  debug: true
}
},{}],6:[function(require,module,exports){
module.exports = {
  name: 'tasks',
  debug: true
}
},{}],7:[function(require,module,exports){
var Router = require('../routers/account_Router.js');
var CardView = require("../views/account_CardView.js");
var layout = require('../helpers/layout_helpers.js');
var config = require('../config/account_config.js');

var api = {

  card: function () {

    var view = new CardView();

    // Then swap the view into the default region
    layout.swap(view, {

      debug: config.debug,

      region: 'header'

    });

  }
  
}

module.exports = {

  start: function () {
    api.card();
  }
  
}

},{"../config/account_config.js":5,"../helpers/layout_helpers.js":10,"../routers/account_Router.js":18,"../views/account_CardView.js":20}],8:[function(require,module,exports){
var Router = require('../routers/tasks_Router.js');
var ListView = require('../views/tasks_ListView.js');
var CardView = require('../views/tasks_CardView.js');
var list = require('../entities/tasks_entity.js');
var layout = require('../helpers/layout_helpers.js');
var config = require('../config/tasks_config.js');

var api = {

  list: function () {

    // Create its view
    var view = new ListView({ collection: list.entity });

    // Then swap the view into the default region
    layout.swap(view, {

      debug: config.debug,

      // And show the loader if necessary
      loading: list.entity.promise(),

      // Artificial delay
      //delay: Math.random() * 2000

    });

  },

  card: function (itemid) {

    var item = list.entity.get(itemid);

    if (!item) item = list.entity.add({id: itemid});

    var view = new CardView({ model: item });

    // Then swap the view into the default region
    layout.swap(view, {

      debug: config.debug,

      // And show the loader if necessary
      loading: item.promise(),

      // Artificial delay
      //delay: Math.random() * 200

    }); 

  }

}

module.exports = {

  start: function () {
    new Router({ controller: api });
    return this;
  }
  
}


},{"../config/tasks_config.js":6,"../entities/tasks_entity.js":9,"../helpers/layout_helpers.js":10,"../routers/tasks_Router.js":19,"../views/tasks_CardView.js":21,"../views/tasks_ListView.js":24}],9:[function(require,module,exports){
var _ = require('underscore');
var List = require('../models/tasks_Collection.js');

module.exports = _.extend({
  entity: new List.Collection()
}, List);

},{"../models/tasks_Collection.js":15,"underscore":"underscore"}],10:[function(require,module,exports){
var $ = require('jquery');
var _ = require('underscore');

// Private
var regions = {
  header: $('[data-js-region="header"'),
  content: $('[data-js-region="content"')

}

// Public
module.exports = {

  swap: function (view, options) {

    options = options || {};

    _.defaults(options, {
      loading: false,
      delay: 0,
      region: 'content'
    });

    var region = regions[options.region];

    if (!!region.view) {
      region.view.off();
      (!!region.view.model) && region.view.model.off();
      region.view.remove();
      delete region.view.$el;
      delete region.view.el;
    }

    region.view = view;
    
    if (!!options.loading) {

      // Notify when promise has started
      (options.debug) && console.log('Loading...');

      // Show Spinner; TODO
      region.html('<div style="width: 330px; margin:0 50%; padding-top: 15%">  <div class="preloader-wrapper small active"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div>');
      
      // Promise callbacks
      options.loading.done(function () {

        // Allow artificial delays for perceived performance
        setTimeout(function () {

          // Notify when the promise has resolved
          (options.debug) && console.log('Resoloved!'); 

          // If view has not changed since the promise was made, render it
          (region.view === view) && region.html(view.render().$el);

        }, Math.round(options.delay));

      });

    }

    else {
      region.html(view.render().$el);
    }

  }

}

},{"jquery":"jquery","underscore":"underscore"}],11:[function(require,module,exports){
module.exports = {
  
  promise: function(options) {
    options = options || {};
    return this.fetch(options).promise();
  }
}

},{}],12:[function(require,module,exports){
module.exports = {
  
  goto: function (fragment) {
    this.navigate(fragment, {trigger: true});
  },

  authorize: function (callback) {
    if(account.isAuthorized()) callback();
  }

}
},{}],13:[function(require,module,exports){
var $ = require('jquery');
var _ = require('underscore');

module.exports = {
  
  compile: function () {

      var resource, template, templater, presenter, compiled, $compiled;

      // Reference model, collection or nonsuch
      resource = (!!this.model) ? this.model : (!!this.collection) ? this.collection : false;

      // Allow overriding of underscore's templater
      templater = _.isFunction(this.templater) ? this.templater : _.template;

      // First run the markup through the templater
      template = templater(this.template);

      // Next mixin the presenter's helpers, return just as data or nothing at all
      presenter = _.isFunction(this.presenter) && (!!resource) ? this.presenter(resource) : (!!resource) ? resource.toJSON() : false;

      // Then run the data through the templater
      compiled = (!!presenter) ? template(presenter) : template();

      // Jquery this sucker
      $compiled = $(compiled);

      // When it's the initial render
      if (!this.rendered) {
        this.setElement($compiled);
        this.rendered = true;
      }

      // When it's a re-render
      else this.$el.html($compiled.html());

      // Store the helpers on the object for later use
      (!!presenter) && (this.helpers = presenter);

      // Chaining
      return this;

    }

}

},{"jquery":"jquery","underscore":"underscore"}],14:[function(require,module,exports){
'use strict';
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');
var account = require('./controllers/account_controller.js');
var tasks = require('./controllers/tasks_controller.js');

$(function() {

  //account.start();
  tasks.start();

  // TODO: {pushState: true} requires thought out server mods
  Backbone.history.start(); 

});

},{"./controllers/account_controller.js":7,"./controllers/tasks_controller.js":8,"backbone":"backbone","backbone.localstorage":"backbone.localstorage","jquery":"jquery"}],15:[function(require,module,exports){
var _ = require('underscore');
var Backbone = require('backbone');
var Model = require('../classes/Model.js');
var Collection = require('../classes/Collection.js');

var ItemModel = Model.extend({

  defaults: {
    'due': false,
    'completed': false,
    'created': Date.now()
  },

  toggle: function () {
    this.save({completed: !this.get('completed') ? Date.now() : false}, {wait: true});
  },

  validate: function (attributes) {
    if ("title" in attributes && attributes.title.length === 0) {
      return "Title cannot be empty.";
    }
  }

});

var ListCollection = Collection.extend({

  model: ItemModel,
  
  localStorage: new Backbone.LocalStorage('TasksApp')

});

module.exports = {

  Model: ItemModel,

  Collection: ListCollection

}
},{"../classes/Collection.js":1,"../classes/Model.js":2,"backbone":"backbone","underscore":"underscore"}],16:[function(require,module,exports){
var _ = require('underscore');

var helpers = {

  has: function (key) {
    return (key in this && this[key].length > 0);
  },

  isComplete: function () {
    return !!this.completed;
  },

  format: function (key) {
    var goal = new Date(this[key]);
    var today = new Date();
    var time = key + ' @ ' + goal.toLocaleTimeString()
    var date = key + ' on ' + goal.toDateString();
    return (goal.getDay() === today.getDay()) ? time : date;
  }

}

module.exports = function (resource) {
  return _.extend(resource.toJSON(), helpers);
}

},{"underscore":"underscore"}],17:[function(require,module,exports){
var _ = require('underscore');

var helpers = {

  totalComplete: function () {
    return _.where(this, {'complete': true}).length;
  }

}

module.exports = function (resource) {
  return _.extend(resource.toJSON(), helpers);
}

},{"underscore":"underscore"}],18:[function(require,module,exports){
var _ = require('underscore');
var Backbone = require('backbone');
var Router = require('../classes/Router.js');

module.exports = Router.extend({

  routes: {
    '': 'api.card'
  }

});

},{"../classes/Router.js":3,"backbone":"backbone","underscore":"underscore"}],19:[function(require,module,exports){
var _ = require('underscore');
var Backbone = require('backbone');
var Router = require('../classes/Router.js');
var config = require('../config/tasks_config.js');

module.exports = Router.extend({

  routes: {
    '': 'list',
    'tasks/:id': 'card'
  },

  initialize: function () {
    this.listenTo(Backbone, config.name + ':goto', this.goto);
  }

});

},{"../classes/Router.js":3,"../config/tasks_config.js":6,"backbone":"backbone","underscore":"underscore"}],20:[function(require,module,exports){
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var config = require('../config/tasks_config.js');

var CardView = View.extend({

  template: require('../../templates/account_CardTemplate.html'),

  render: function () {

    this.compile();
    return this.$el;

  }

});

module.exports = CardView;

},{"../../templates/account_CardTemplate.html":25,"../classes/View.js":4,"../config/tasks_config.js":6,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],21:[function(require,module,exports){
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var config = require('../config/tasks_config.js');

var CardView = View.extend({

  events: {
    'keyup': 'onEscape',
    'mouseup #toggle': 'toggle',
    'mouseup #back': 'back',
    'mouseup #delete': 'delete',
    'blur #title-input': 'updateTitle',
    'blur #details-input': 'updateDetails'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  template: require('../../templates/tasks_CardTemplate.html'),

  presenter: require('../presenters/tasks_itemPresenter.js'),

  toggle: function () {
    this.model.toggle();
  },

  back: function () {
    Backbone.trigger(config.name + ':goto', '');
  },

  onEscape: function (event) {
    if (event.which === 27) {
      this.back();
    }
  },

  delete: function () {
    this.model.destroy();
    var that = this;
    this.$el.fadeOut('fast', function () {
      that.remove();
      Backbone.trigger(config.name + ':goto', '');
    });  
  },

  updateTitle: function () {
    this.model.save({'title': this.$('#title-input').val().trim()}, {wait: true});
  },

  updateDetails: function () {
    this.model.save({'details': this.$('#details-input').val().trim()}, {wait: true});
  },

  render: function () {

    // Compile allows chaining
    return this.compile();
    
  }
  
});

module.exports = CardView;

},{"../../templates/tasks_CardTemplate.html":26,"../classes/View.js":4,"../config/tasks_config.js":6,"../presenters/tasks_itemPresenter.js":16,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],22:[function(require,module,exports){
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var config = require('../config/tasks_config.js');

var EmptyView = View.extend({

  template: require('../../templates/tasks_EmptyTemplate.html'),

  render: function () {

    this.compile();
    return this.$el;

  }

});

module.exports = EmptyView;

},{"../../templates/tasks_EmptyTemplate.html":27,"../classes/View.js":4,"../config/tasks_config.js":6,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],23:[function(require,module,exports){
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var config = require('../config/tasks_config.js');

var ItemView = View.extend({

  events: {
    'mouseup  .toggle' : 'toggle',
    'dblclick .open'   : 'open',
    'mouseup  .delete' : 'delete'
  },

  template: require('../../templates/tasks_ItemTemplate.html'),

  presenter: require('../presenters/tasks_itemPresenter.js'),

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  toggle: function () {
    this.model.toggle();
  },

  open: function () {
    Backbone.trigger(config.name + ':goto', 'tasks/' + this.model.id);
  },

  delete: function () {
    this.model.destroy();
    this.remove();
  },

  style: function () {

    if (this.helpers.isComplete()) {
      this.$('.open').addClass('complete');
    }

    // Chaining
    return this;

  },

  render: function () {

    // Compile allows chaining
    return this.compile();

  }
  
});

module.exports = ItemView;

},{"../../templates/tasks_ItemTemplate.html":28,"../classes/View.js":4,"../config/tasks_config.js":6,"../presenters/tasks_itemPresenter.js":16,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],24:[function(require,module,exports){
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var ItemView = require('./tasks_ItemView.js');
var EmptyView = require('./tasks_EmptyView.js');
var config = require('../config/tasks_config.js');

var ListView = View.extend({

  events: {
    'keyup #input-title': 'onEnter'
  },

  template: require('../../templates/tasks_ListTemplate.html'),

  presenter: require('../presenters/tasks_listPresenter.js'),

  onEnter: function (event) {

    if (event.which === 13) {
      var input = this.$('#input-title');
      this.collection.create({'title': input.val().trim()}, {wait: true});
      input.val('');
      this.render();
    }

  },

  render: function () {

    this.compile();

    var $list = this.$('ul#task-items').empty();
    var $listfragment = $(document.createDocumentFragment());

    this.collection.each(function (itemModel, index) {
      new ItemView({model: itemModel}).render().style().$el.appendTo($listfragment);
    });

    $listfragment.appendTo($list);

    // Chaining
    return this;

  }

});

module.exports = ListView;

},{"../../templates/tasks_ListTemplate.html":29,"../classes/View.js":4,"../config/tasks_config.js":6,"../presenters/tasks_listPresenter.js":17,"./tasks_EmptyView.js":22,"./tasks_ItemView.js":23,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],25:[function(require,module,exports){
module.exports = "<div class=\"chip\">\n    <i class=\"material-icons\">account_circle</i> John Doe\n</div>";

},{}],26:[function(require,module,exports){
module.exports = "<div class=\"row\">\n  <div class=\"col m3 l4\">&nbsp;</div>\n  <div class=\"col s12 m6 l4\">\n\n    <div class=\"row\">\n      <div class=\"col s12 m12 s12\">\n        <div class=\"card medium\">\n\n        <div class=\"card-image\">\n          <img src=\"https://lh3.googleusercontent.com/oYTDhdPslCz2blZxLGFpQrxOzmmDnwp_9IlS_me6iXfP_TpludEg6koA5ISY4ewr9lBmrg=w1920-h1200-rw-no\">\n          <span class=\"card-title\">\n            <div class=\"input-field\">\n              <input id=\"title-input\" type=\"text\" length=\"23\" value=\"<%- title %>\" />\n              <label for=\"title-input\"></label>\n            </div>\n          </span>\n        </div>\n\n          <div class=\"card-content row\">\n            <div class=\"input-field col s12 m12 s12\">\n              <textarea id=\"details-input\" class=\"materialize-textarea\" rows=\"1\"><% has('details') && print(details) %></textarea>\n              <label for=\"details-input\" id=\"details-label\"><% !has('details') && print(\"Add details...\") %></label>\n            </div>\n\n          </div>\n          \n          <div class=\"card-action\">\n            <a href=\"#\">This is a link</a>\n          </div>\n\n        </div>\n      </div>\n    </div>\n      \n  </div>\n  <div class=\"col m3 l4\">\n    <div class=\"fixed-action-btn\" style=\"bottom: 45px; right: 24px;\">\n      <a class=\"btn-floating btn-large\">\n        <i class=\"large mdi-navigation-menu\"></i>\n      </a>\n      <ul>\n        <li><a class=\"btn-floating green\" id=\"togg<le\"><i class=\"material-icons\">done</i></a></li>\n        <li><a class=\"btn-floating red\" id=\"delete\"><i class=\"material-icons\">delete</i></a></li>\n        <li><a class=\"btn-floating blue\" id=\"back\"><i class=\"material-icons\">arrow_back</i></a></li>\n      </ul>\n    </div>\n  </div>\n</div>\n";

},{}],27:[function(require,module,exports){
module.exports = "<li class=\"collection-item\">\n  <span class=\"title\">Empty</span>\n</li>\n";

},{}],28:[function(require,module,exports){
module.exports = "<li class=\"collection-item custom-avatar\">\n    <span class=\"avatar-content\">\n      <input type=\"checkbox\" id=\"toggle-<%- id %>\" <% isComplete() && print('checked') %>/>\n      <label for=\"toggle-<%- id %>\" class=\"toggle\">&nbsp;</label>\n    </span>\n    <span class=\"title open\"><%- title %></span>\n    <p class=\"grey-text truncate\">\n      <% has('details') && print(details, '<br>') %>\n      <% print(format('created'), '<br>') %>\n      <% has('due') && print(format('due'), '<br>') %>\n      <% isComplete() && print(format('completed')) %>\n    </p>\n    <a class=\"custom-secondary-content delete\">\n      <i class=\"material-icons\">delete</i>\n    </a>\n</li>\n";

},{}],29:[function(require,module,exports){
module.exports = "<div class=\"row\">\n  <div class=\"col s0 m3 l4\">&nbsp;</div>\n  <div class=\"col s12 m6 l4\">\n    <div class=\"row\">\n      <div class=\"input-field col s12 m12 l12\">\n        <input id=\"input-title\" type=\"text\" length=\"23\">\n        <label for=\"input-title\">What needs to be done?</label>\n      </div>\n      <div class=\"col s12 m12 l12\">\n        <ul id=\"task-items\" class=\"collection\">No tasks for today.</ul>\n      </div>\n    </div>\n  </div>\n  <div class=\"col s0 m3 l4\">\n    <div class=\"fixed-action-btn\" style=\"bottom: 45px; right: 24px;\">\n      <a class=\"btn-floating btn-large\">\n        <i class=\"large mdi-navigation-menu\"></i>\n      </a>\n      <ul>\n        <li><a class=\"btn-floating green\" id=\"done\"><i class=\"material-icons\">done_all</i></a></li>\n        <li><a class=\"btn-floating red\" id=\"delete\"><i class=\"material-icons\">delete</i></a></li>\n        <li><a class=\"btn-floating blue\" id=\"settings\"><i class=\"material-icons\">settings</i></a></li>\n      </ul>\n    </div>\n  </div>\n</div>\n";

},{}]},{},[14]);
