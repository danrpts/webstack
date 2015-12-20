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
      //delay: Math.random() * 1000

    }); 

  }

}

module.exports = {

  start: function () {
    new Router({ controller: api });
    return this;
  }
  
}


},{"../config/tasks_config.js":6,"../entities/tasks_entity.js":9,"../helpers/layout_helpers.js":10,"../routers/tasks_Router.js":19,"../views/tasks_CardView.js":21,"../views/tasks_ListView.js":23}],9:[function(require,module,exports){
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

      var resource, template, templater, presenter, compiled;

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
      this.$compiled = $(compiled);

      // Store the helpers on the object for later use
      (!!presenter) && (this.helpers = presenter);

      // Chaining
      return this;

    },

    render: function (callback) {

      // Compile the $el
      this.compile();

      // When it's the initial render
      if (!this.rendered) {
        this.setElement(this.$compiled);
        this.rendered = true;
      }

      // When it's a re-render
      else this.$el.html(this.$compiled.html());

      // Allow injection of async code
      _.isFunction(callback) && callback.call(this);

      // Material Design Lite (MDL)
      componentHandler.upgradeElements(this.el);

      // Force chaining on this
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

  toggle: function (options) {
    
    _.defaults(options, {
      wait: true
    });
    this.save({completed: !this.get('completed') ? Date.now() : false}, options);

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

  template: require('../../templates/account_CardTemplate.html')

});

module.exports = CardView;

},{"../../templates/account_CardTemplate.html":24,"../classes/View.js":4,"../config/tasks_config.js":6,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],21:[function(require,module,exports){
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var config = require('../config/tasks_config.js');

var CardView = View.extend({

  events: {
    'mouseup .toggle': 'toggle',
    'mouseup .back': 'back',
    'mouseup .delete': 'delete',
    'blur #title-input': 'updateTitle',
    'blur #details-input': 'updateDetails'
  },

  template: require('../../templates/tasks_CardTemplate.html'),

  presenter: require('../presenters/tasks_itemPresenter.js'),

  initialize: function () {

    // this is bugged
    // change is fired on sync due to localstorage, promise and events combo
    // causes premature render
    // need to rethink
    // may be an edge case
    // mixing promises and backbones event system is difficult...
    this.listenTo(this.model, 'change', this.render);
  },

  back: function () {
    Backbone.trigger(config.name + ':goto', '');
  },

  toggle: function () {
    this.model.toggle();
  },

  delete: function () {
    this.model.destroy();
    this.remove();
    this.back();
  },

  updateTitle: function () {
    this.model.save({'title': this.$('#title-input').val().trim()}, {wait: true});
  },

  updateDetails: function () {
    this.model.save({'details': this.$('#details-input').val().trim()}, {wait: true});
  }
  
});

module.exports = CardView;

},{"../../templates/tasks_CardTemplate.html":25,"../classes/View.js":4,"../config/tasks_config.js":6,"../presenters/tasks_itemPresenter.js":16,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],22:[function(require,module,exports){
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
  }
  
});

module.exports = ItemView;

},{"../../templates/tasks_ItemTemplate.html":26,"../classes/View.js":4,"../config/tasks_config.js":6,"../presenters/tasks_itemPresenter.js":16,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],23:[function(require,module,exports){
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var ItemView = require('./tasks_ItemView.js');
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

    // List building function
    function list () {
      var $list = this.$('ul#task-items');
      var $listfragment = $(document.createDocumentFragment());
      this.collection.each(function (itemModel, index) {
        new ItemView({model: itemModel}).render().$el.appendTo($listfragment);
      });
      $listfragment.appendTo($list);
    }

    // Call the base renderer
    return View.prototype.render.call(this, list);

  }

});

module.exports = ListView;

},{"../../templates/tasks_ListTemplate.html":27,"../classes/View.js":4,"../config/tasks_config.js":6,"../presenters/tasks_listPresenter.js":17,"./tasks_ItemView.js":22,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],24:[function(require,module,exports){
module.exports = "<div class=\"chip\">\n    <i class=\"material-icons\">account_circle</i> John Doe\n</div>";

},{}],25:[function(require,module,exports){
module.exports = "<div class=\"app\">\n\n    <div class=\"mdl-card__menu\">\n      <button class=\"mdl-button mdl-js-button mdl-button--fab toggle\">\n        <i class=\"material-icons\">check</i>\n      </button>\n    </div>\n\n    <div class=\"mdl-card mdl-shadow--2dp\">\n\n      <div class=\"mdl-card__supporting-text\">\n        <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n          <input class=\"mdl-textfield__input\" type=\"text\" id=\"title-input\" length=\"23\">\n          <label class=\"mdl-textfield__label\" for=\"title-input\"><%- title %></label>\n        </div>\n\n        <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n          <textarea class=\"mdl-textfield__input\" type=\"text\" rows= \"1\" id=\"details-input\" ></textarea>\n          <label class=\"mdl-textfield__label\" for=\"details-input\"><% has('details') ? print(details) : print(\"Add details\") %></label>\n        </div>\n      </div>\n\n      <div class=\"mdl-card__actions mdl-card--border\">\n\n        <button class=\"mdl-button mdl-js-button mdl-button--icon back\">\n          <i class=\"material-icons\">arrow_back</i>\n        </button>\n\n        <button class=\"mdl-button mdl-js-button mdl-button--icon delete\">\n          <i class=\"material-icons\">delete</i>\n        </button>\n\n        <button class=\"mdl-button mdl-js-button mdl-button--icon mood\">\n          <i class=\"material-icons\">mood</i>\n        </button>\n\n      </div>\n\n    </div>\n\n</div>\n";

},{}],26:[function(require,module,exports){
module.exports = "<li>\n  <div class=\"mdl-card mdl-shadow--2dp\">\n    <div class=\"mdl-card__supporting-text\">\n\n    <div class=\"avatar-wrapper\">\n\n      <div class=\"avatar\">\n        <label class=\"mdl-checkbox mdl-js-checkbox toggle\" for=\"checkbox-<%- id %>\">\n          <input type=\"checkbox\" id=\"checkbox-<%- id %>\" class=\"mdl-checkbox__input\" <% isComplete() && print('checked') %>>\n        </label>\n      </div>\n\n      <span class=\"title open <% isComplete() && print('complete') %>\"><%- title %></span>\n\n      <p>\n        <% has('details') && print(details, '<br>') %>\n        <% print(format('created'), '<br>') %>\n        <% has('due') && print(format('due'), '<br>') %>\n        <% isComplete() && print(format('completed')) %>\n      </p>\n\n      <div class=\"menu\">\n      <button class=\"mdl-button mdl-js-button mdl-button--icon delete\">\n          <i class=\"material-icons\">delete</i>\n        </button>\n      </div>\n\n    </div>\n\n    </div>\n  </div>\n</li>";

},{}],27:[function(require,module,exports){
module.exports = "<div class=\"app\">\n  <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n    <input class=\"mdl-textfield__input\" type=\"text\" id=\"input-title\" length=\"23\">\n    <label class=\"mdl-textfield__label\" for=\"input-title\">What needs to be done?</label>\n  </div>\n  <ul id=\"task-items\"></ul>\n</div>\n";

},{}]},{},[14]);
