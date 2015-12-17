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
      (options.debug) && console.log('Loading...');
      region.html('<div style="width: 330px; margin:0 50%; padding-top: 15%">  <div class="preloader-wrapper small active"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div>');
      options.loading.done(function () {
        setTimeout(function () {


          (options.debug) && console.log('Resoloved!'); 

          // If view has not changed since the promise was made, render it
          (region.view === view) && region.html(view.render());
        }, Math.round(options.delay));
      });
    }

    else {
      region.html(view.render());
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
  
  prepare: function ($compiled) {

    // When it's the initial render
    if (!this._rendered) {
      this.setElement($compiled);
      this._rendered = true;
    }

    // When it's a re-render
    else this.$el.html($compiled.html());

    // Return the 
    return this.$el;
    
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
    'complete': false
  },

  toggle: function () {
    this.save({complete: !this.get('complete')}, {wait: true});
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

  isComplete: function () {
    return !!this.complete;
  },

  hasDetails: function () {
    return ("details" in this && this.details.length > 0);
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

    console.log('showing account card');

    // Build template
    var $compiled = $(this.template);
    this.prepare($compiled);

    // Return the cached el
    return this.$el;

  }

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

  presenter: require('../presenters/tasks_itemPresenter.js'),

  template: _.template(require('../../templates/tasks_CardTemplate.html')),

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

    // Build template
    var helpers = _.isFunction(this.presenter) ? this.presenter(this.model) : this.model.toJSON();
    var $compiled = _.isFunction(this.template) ? $(this.template(helpers)) : $(template);
    this.prepare($compiled);
    
    if (helpers.isComplete()) {
      this.$('#toggle').toggleClass('mdl-color--green');
    }

    return this.$el;
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

  presenter: require('../presenters/tasks_itemPresenter.js'),

  template: _.template(require('../../templates/tasks_ItemTemplate.html')),

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
    var that = this;
    this.$el.fadeOut('slow', function () {
      that.remove();
    });
  },

  render: function () {

    // Build template
    var helpers = _.isFunction(this.presenter) ? this.presenter(this.model) : this.model.toJSON();
    var $compiled = _.isFunction(this.template) ? $(this.template(helpers)) : $(template);
    this.prepare($compiled);

    if (helpers.isComplete()) {
      this.$('.open').addClass('complete');
    }

    return this.$el;
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

  presenter: require('../presenters/tasks_listPresenter.js'),

  template: _.template(require('../../templates/tasks_ListTemplate.html')),

  onEnter: function (event) {
    if (event.which === 13) {
      var input = this.$('#input-title');
      this.collection.create({'title': input.val().trim()}, {wait: true});
      input.val('');
      this.render();
    }
  },

  render: function () {

    // Build template
    var helpers = _.isFunction(this.presenter) ? this.presenter(this.collection) : this.collection.toJSON();
    var $compiled = _.isFunction(this.template) ? $(this.template(helpers)) : $(template);
    this.prepare($compiled);

    var $list = this.$('ul');
    var $listfragment = $(document.createDocumentFragment());
    this.collection.each(function (itemModel, index) {
      new ItemView({model: itemModel}).render().appendTo($listfragment);
    });
    $listfragment.appendTo($list);

    // Returning $el instead
    return this.$el;
  }
});

module.exports = ListView;

},{"../../templates/tasks_ListTemplate.html":27,"../classes/View.js":4,"../config/tasks_config.js":6,"../presenters/tasks_listPresenter.js":17,"./tasks_ItemView.js":22,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],24:[function(require,module,exports){
module.exports = "<div class=\"chip\">\n    <i class=\"material-icons\">account_circle</i> John Doe\n</div>";

},{}],25:[function(require,module,exports){
module.exports = "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col s12 m12 l12\">\n      <div class=\"card grey lighten-5 z-depth-1\">\n\n        <div class=\"row card-content\">\n          <div class=\"input-field col s12 m12 l12\">\n            <input id=\"title-input\" type=\"text\" length=\"23\" />\n            <label for=\"title-input\"><%- title %></label>\n          </div>\n        </div>\n\n        <div class=\"row card-content\">\n          <div class=\"input-field col s12 m12 l12\">\n            <textarea id=\"details-input\" class=\"materialize-textarea\"><% hasDetails() && print(details) %></textarea>\n            <label for=\"details-input\" id=\"details-label\"><% !hasDetails() && print(\"Add details...\") %></label>\n          </div>\n        </div>\n\n        <div class=\"card-action\">\n          <div class=\"row valign-wrapper custom-row\">\n            <div class=\"circle back grey-text text-darken-5\" id=\"back\">\n              <i class=\"material-icons left\">arrow_back</i>\n            </div>\n            <div class=\"circle delete grey-text text-darken-5\" id=\"delete\">\n              <i class=\"material-icons left\">delete</i>\n            </div>\n          </div>\n        </div>\n        \n      </div>\n    </div>\n  </div>\n</div>\n\n      ";

},{}],26:[function(require,module,exports){
module.exports = "<li>\n\n  <div class=\"card-panel grey lighten-5 z-depth-1\">\n    <div class=\"row valign-wrapper custom-row\">\n      \n      <div class=\"col s1 valign-wrapper\">\n        <input type=\"checkbox\" id=\"checkbox-<%= id %>\" <% isComplete() && print('checked') %> />\n        <label for=\"checkbox-<%= id %>\" class=\"toggle\"></label>\n      </div>\n\n      <div class=\"col s8\">\n        <span class=\"black-text open\" id=\"text-<%= id %>\">\n          <%- title%>\n        </span>\n      </div>\n\n      <div class=\"col s3\">\n        <div class=\"circle delete grey-text text-darken-5\" id=\"delete-<%= id %>\">\n          <i class=\"material-icons right\">delete</i>\n        </div>\n      </div>\n    \n    </div>\n  </div>\n\n</li>\n";

},{}],27:[function(require,module,exports){
module.exports = "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col s12 m12 l12\">\n\n      <div class=\"row\">\n        <div class=\"input-field col s12\">\n          <input id=\"input-title\" type=\"text\" length=\"23\">\n          <label for=\"input-title\">What needs to be done?</label>\n        </div>\n      </div>\n\n      <ul></ul>\n    \n    </div>\n  </div>\n</div>";

},{}]},{},[14]);
