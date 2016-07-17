(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var backbone = require('backbone');
var helpers = require('../helpers/collection_helpers.js');
var create = _.isFunction(Object.create) ? Object.create : _.create;

var Collection = module.exports = function (models, options) {
  backbone.Collection.apply(this, arguments);
}

Collection.prototype = create(backbone.Collection.prototype);

_.extend(Collection.prototype, helpers);

Collection.extend = backbone.Collection.extend;

},{"../helpers/collection_helpers.js":13,"backbone":"backbone","underscore":"underscore"}],2:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var backbone = require('backbone');
var helpers = require('../helpers/model_helpers.js');
var create = _.isFunction(Object.create) ? Object.create : _.create;

var Model = module.exports = function (attributes, options) {
  backbone.Model.apply(this, arguments);
}

Model.prototype = create(backbone.Model.prototype);

_.extend(Model.prototype, helpers);

Model.extend = backbone.Model.extend;

},{"../helpers/model_helpers.js":15,"backbone":"backbone","underscore":"underscore"}],3:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var backbone = require('backbone');
var helpers = require('../helpers/router_helpers.js');
var create = _.isFunction(Object.create) ? Object.create : _.create;

var Router = module.exports = function (options) {
  backbone.Router.apply(this, arguments);
}

Router.prototype = create(backbone.Router.prototype);

_.extend(Router.prototype, helpers);

Router.extend = backbone.Router.extend;

},{"../helpers/router_helpers.js":18,"backbone":"backbone","underscore":"underscore"}],4:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var backbone = require('backbone');
var rendering_helpers = require('../helpers/render_helpers.js');
var compositing_helpers = require('../helpers/composite_helpers.js');
var create = _.isFunction(Object.create) ? Object.create : _.create;

var View = module.exports = function (options) {
  backbone.View.apply(this, arguments);
  this.initializeCompositing();
}

View.prototype = create(backbone.View.prototype);

_.extend(View.prototype, rendering_helpers, compositing_helpers);

View.extend = backbone.View.extend;

},{"../helpers/composite_helpers.js":14,"../helpers/render_helpers.js":17,"backbone":"backbone","underscore":"underscore"}],5:[function(require,module,exports){
module.exports={
  "client_id": "942671175535-e5rg5spr5pobm1tqai0m2l3jokvpb9q8.apps.googleusercontent.com",
  "redirect_uri": "postmessage"
}
},{}],6:[function(require,module,exports){
module.exports={
  "ENTER": 13
}
},{}],7:[function(require,module,exports){
'use strict';

var Account_Card_View = require('../views/Account_Card_View.js');

var account = require('../singletons/account_singleton.js');

module.exports = function () {

  account.fetch();

  var account_card_view = new Account_Card_View({ model: account });

  return account_card_view;
  
}
},{"../singletons/account_singleton.js":25,"../views/Account_Card_View.js":27}],8:[function(require,module,exports){
'use strict';

var Account_Link_View = require('../views/Account_Link_View.js');

var account = require('../singletons/account_singleton.js');

module.exports = function () {

  account.fetch();

  var account_link_view = new Account_Link_View({ model: account });

  return account_link_view;
  
}
},{"../singletons/account_singleton.js":25,"../views/Account_Link_View.js":28}],9:[function(require,module,exports){
'use strict';

var Account_Page_View = require('../views/Account_Page_View.js');

module.exports = function () {

  var account_page_view = new Account_Page_View();

  return account_page_view;
  
}

},{"../views/Account_Page_View.js":29}],10:[function(require,module,exports){
'use strict';

var Task_Card_View = require('../views/Task_Card_View.js');

var tasks = require('../singletons/tasks_singleton.js');

module.exports = function (id, options) {
  
  var task = tasks.lookup(id);

  var task_card_view = new Task_Card_View({ model: task });

  return task_card_view;

}

},{"../singletons/tasks_singleton.js":26,"../views/Task_Card_View.js":31}],11:[function(require,module,exports){
'use strict';

var Task_List_View = require('../views/Task_List_View.js');

var tasks = require('../singletons/tasks_singleton.js');

module.exports = function () {

  tasks.fetch();

  var task_list_view = new Task_List_View({ collection: tasks });

  return task_list_view;
  
}
},{"../singletons/tasks_singleton.js":26,"../views/Task_List_View.js":33}],12:[function(require,module,exports){
'use strict';

var Task_Page_View = require('../views/Task_Page_View.js');

module.exports = function () {

  var task_page_view = new Task_Page_View();

  return task_page_view;
  
}

},{"../views/Task_Page_View.js":34}],13:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var backbone = require('backbone');
module.exports = {

  sync: function () {
    return this.promise = backbone.Collection.prototype.sync.apply(this, arguments);
  },

  // TODO: 3 layer lookup local, cache, server
  // https://youtu.be/P0YIdsJqKV4
  lookup: function (itemid) {

    var model;

    // Find model in local collection
    if (model = this.get(itemid)) {

      // Set it resolved on the model for presenter/template logic
      model.promise = $.Deferred().resolveWith(this, [model]).promise();

    }

    // Try to find cached model in local storage
    else {

      // First create an instance and fetch it
      model = this.add({ id: itemid });

      // Fetch from cache
      model.fetch();

      // Note: the callback receives the serialized model

    }

    return model;

  }

}
},{"backbone":"backbone","jquery":"jquery"}],14:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var _ = require('underscore');

module.exports = {

  freeViews: function (selector) {

    _.each(this.views[selector], function (view) {

        this.stopListening(view);

        view.remove();

    }, this);

    this.views[selector].splice(0, this.views[selector].length);

    delete this.views[selector];

  },

  freeAllViews: function () {

    _.keys(this.views, function (selector) {

      this.freeViews(selector);

    }, this);

  },

  appendViews: function (set, selector) {

    set = _.isArray(set) ? set : [set];

    var $fragment = $(document.createDocumentFragment());

    _.each(set, function (view) {

      this.views[selector] = this.views[selector] || [];

      this.views[selector].push(view);

      // A special case when a child view is managed and it
      // removes itself from the DOM. The parent must then
      // free it manually from internal storage.
      this.listenTo(view, 'post:remove', function () {

        this.stopListening(view);

        var index = _.indexOf(this.views[selector], view);

        this.views[selector].splice(index, 1);

      });

      view.render().$el.appendTo($fragment);

    }, this);

    $fragment.appendTo(this.$(selector));

  },

  setViews: function (set, selector) {

    _.has(this.views, selector)

      && this.freeViews(selector);

    this.appendViews(set, selector);

  },

  setDefaultViews: function () {

    // The defaultViews object is used to generate a default
    // scene by setDefaultViews, which may be called any number
    // of times by the parent to reset the scene to default.
    
    _.each(this.defaultViews, function (set, selector) {

      set =

      _.isFunction(set) && set()

      ||

      _.isString(set) && _.result(this, set, []);

      set = _.isArray(set) ? set : [set];

      this.setViews(set, selector);

    }, this);

  },

  resetCurrentViews: function () {

    _.each(this.views, function (set, selector) {

      var $fragment = $(document.createDocumentFragment());

      _.each(set, function (view) {

        view.undelegateEvents();

        view.$el.detach();

        view.delegateEvents();

        view.$el.appendTo($fragment);

      });

      $fragment.appendTo(this.$(selector));

    }, this);

  },

  initializeCompositing: function () {

    this.views = {};

    this.listenTo(this, 'pre:remove', this.freeAllViews);

    this.listenTo(this, 'init:render', this.setDefaultViews);

    this.listenTo(this, 're:render', this.resetCurrentViews);

  }

}
},{"jquery":"jquery","underscore":"underscore"}],15:[function(require,module,exports){
'use strict';

var backbone = require('backbone');

module.exports = {

  sync: function () {
    return this.promise = backbone.Model.prototype.sync.apply(this, arguments);
  }
  
}

},{"backbone":"backbone"}],16:[function(require,module,exports){
var _ = require('underscore');

module.exports = function (resource, view) {

  return {

    rid: function () {
      return resource.id || undefined;
    },

    vid: function () {
      return view.cid || undefined;
    },

    get: function (key) {
      return resource.get(key);
    },

    has: function (key) {
      return !! resource.get(key);
    },

    size: function () {
      return resource.length;
    },

    each: function (callback) {
      resource.each(callback, resource);
    },

    format: function (key) {
      var timestamp = new Date(resource.get(key));
      var today = new Date();
      var time = key + ' @ ' + timestamp.toLocaleTimeString();
      var date = key + ' on ' + timestamp.toDateString();
      return (timestamp.getDay() === today.getDay()) ? time : date;
    },

    state: function (value) {
      return resource.promise 
        && (resource.promise.state() === value);
    }

  }
}

},{"underscore":"underscore"}],17:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var _ = require('underscore');
var backbone = require('backbone');
var closure = require('./presenter_helpers.js');

module.exports = {

  remove: function () {

    var options = _.last(arguments);

    $.Deferred().resolveWith(this)

    .then(function () {
      _.isFunction(this.preremove)
        && this.preremove(options);
      this.trigger('pre:remove', options);
    })
    
    .then(function () {

      this.rendered = false;

      // Detach from the DOM
      backbone.View.prototype.remove.apply(this, arguments);

    })
    
    .then(function () {
      _.isFunction(this.postremove)
        && this.postremove(options);
      this.trigger('post:remove', options);
    });

    return this;

  },

  resource: function () {

    return this.model || this.collection || {};
  
  },

  // Build template using its presenter
  compile: function (options) {

    // Get cached presenter or create a new one
    this.presenter = this.presenter
      || closure(this.resource(), this);

    // Allow overriding of underscore's templater
    var engine = _.isFunction(this.engine)
      ? this.engine
      : _.template;

    var template = engine(this.template)(this.presenter);
    
    this.$template = $(template);
    
    if (!this.rendered) {
      this.setElement(this.$template);
      this.rendered = true;
      this.trigger('init:render');
    }

    else {
      this.$el.html(this.$template.html());
      this.trigger('re:render');
    }

    return this;

  },

  render: function () {

    var options = _.last(arguments);

    $.Deferred().resolveWith(this)

    .then(function () {
      _.isFunction(this.prerender)
        && this.prerender(options);
      this.trigger('pre:render', options);
    })

    .then(function () {
      this.compile(options);
    })

    .then(function () {
      _.isFunction(this.postrender)
        && this.postrender(options);
      this.trigger('post:render', options);
    });
    
    return this;
  
  }

}

},{"./presenter_helpers.js":16,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],18:[function(require,module,exports){
'use strict';

var backbone = require('backbone');

module.exports = {
  
  to: function (fragment) {
    if (fragment === '<') window.transition.back();
    else if (fragment === '>') window.transition.forward();
    else backbone.Router.prototype.navigate.call(this, fragment, true);
  },

  back: function () {
    window.history.back();
  },

  forward: function () {
    window.history.forward();
  }

}

},{"backbone":"backbone"}],19:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var backbone = require('backbone');
backbone.LocalStorage = require('backbone.localstorage');
var Transition_Router = require('./routers/Transition_Router.js');

$(function() {

  window.transition = new Transition_Router();

  $(document).on('click', '[href^="/"]', function (event) {

    var href = $(event.currentTarget).attr('href')

    !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey
      && event.preventDefault();

    var fragment = href.replace(/^\//, '').replace('\#\!\/', '');

    window.transition.to(fragment);

    return false

  });

  // TODO:
  // Using { pushState: true } requires thought-out server
  backbone.history.start({ pushState: true }); 

});

},{"./routers/Transition_Router.js":24,"backbone":"backbone","backbone.localstorage":"backbone.localstorage","jquery":"jquery"}],20:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var backbone = require('backbone');
var Model = require('../classes/Model.js');

module.exports = Model.extend({

  defaults: {
    'id': undefined,
    'greeting': 'Howdy',
    'name': undefined,
    'image_url': undefined,
    'email': undefined,
    'provider': undefined,
    'fully_signed_in': false
  }

});

},{"../classes/Model.js":2,"backbone":"backbone","jquery":"jquery"}],21:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var _ = require('underscore');
var AccountModel = require('./Account_Model.js');
var config = require('../config/google_config.json');

var googleAuthDeferred = $.Deferred();

module.exports = AccountModel.extend({

  initialize: function () {

    if (!_.has(gapi, 'auth2')) {

      // Load the auth2 api
      gapi.load('auth2', function () {

        // Initiate new 'auth client'
        gapi.auth2.

        init({ 
          'client_id': config.client_id 
        }).

        then(googleAuthDeferred.resolve);

      });

    }

  },

  setGoogleUser: function (user) {

    this.set(this.defaults, { silent: true });

    if (user.isSignedIn()) {

      var profile = user.getBasicProfile();
    
      this.set({
        'id': profile.getId(),
        'name': profile.getName(),
        'image_url': profile.getImageUrl(),
        'email': profile.getEmail(),
        'provider': 'Google'
      });

    }

    else this.clear();

  },

  signIn: function (callback) {

    var model = this;

    console.log('Signing into Google...');

    googleAuthDeferred.

    done(function (googleAuth) {

      googleAuth.
      
      signIn().
      
      then(function (user) {

        console.log('...signed in.');

        model.setGoogleUser(user);

        _.isFunction(callback)
          && callback();

      });

    });

    return this;

  },

  signOut: function (callback) {

    var model = this;

    console.log('Signing out of Google...');

    googleAuthDeferred.

    done(function (googleAuth) {

      googleAuth.
    
      signOut().

      then(function () {

        console.log('...signed out.');

        _.isFunction(callback)
          && callback();

      });

    });

    return this;

  },

  grantOfflineAccess: function (callback) {

    var context = this;

    console.log('Fully signing in...');

    googleAuthDeferred.

    done(function (googleAuth) {

      googleAuth.
    
      grantOfflineAccess({  // Grant the one-time code
        'redirect_uri': config.redirect_uri
      }).
      
      then(function (response) {

        console.log('... functionality not yet available.');

        // context.set('token', response.code);

        // TODO: Post to server

      });

    });

    return this;

  },

  fetch: function (options) {

    // TODO: Explore errors and return values

    var model = this;

    this.promise = this.promise || $.Deferred();

    this.trigger('request', this.promise, options);

    googleAuthDeferred.
    done(function (googleAuth) {
      var user = googleAuth.currentUser.get();
      model.promise.
      resolveWith(model, user);
      model.setGoogleUser(user);
      model.trigger('sync', model, user);
    });

    return this.promise;

  }

});

},{"../config/google_config.json":5,"./Account_Model.js":20,"jquery":"jquery","underscore":"underscore"}],22:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var backbone = require('backbone');
var Model = require('../classes/Model.js');

module.exports = Model.extend({

  defaults: {
    'due': null,
    'completed': null,
    'details': null,
    'created': null
  },

  complete: function (bool) {
    this.save({
      completed : bool ? Date.now() : null
    });
  },

  toggleCompletion: function () {
    !!this.get('completed')
      ? this.complete(false)
      : this.complete(true);
  },

  validate: function (attributes) {
    if (_.has(attributes, 'title') && attributes.title.length === 0) {
      return "Title cannot be empty.";
    }
  }

});

},{"../classes/Model.js":2,"backbone":"backbone","underscore":"underscore"}],23:[function(require,module,exports){
'use strict';

var backbone = require('backbone');

var Collection = require('../classes/Collection.js');

var Task_Item_Model = require('../models/Task_Item_Model');

module.exports = Collection.extend({

  model: Task_Item_Model,
  
  localStorage: new backbone.LocalStorage('TasksApp')

});

},{"../classes/Collection.js":1,"../models/Task_Item_Model":22,"backbone":"backbone"}],24:[function(require,module,exports){
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

},{"../classes/Router.js":3,"../views/Index_Root_View.js":30,"underscore":"underscore"}],25:[function(require,module,exports){
'use strict';

var GoogleAccountModel = require('../models/Google_Account_Model.js');

module.exports =  new GoogleAccountModel();

},{"../models/Google_Account_Model.js":21}],26:[function(require,module,exports){
'use strict';

var Task_List_Collection = require('../models/Task_List_Collection.js');

module.exports = new Task_List_Collection();

},{"../models/Task_List_Collection.js":23}],27:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var _ = require('underscore');
var View = require('../classes/View.js');
var account = require('../singletons/account_singleton.js');
var codes = require('../config/keycodes_config.json');

module.exports = View.extend({

  template: require('../../templates/account_card_template.html'),

  events: {
    'mouseup #grantOfflineAccess': 'grantOfflineAccess',
    'mouseup #signOut': 'signOut',
    'keyup #inputGreeting': 'onEnter'

  },
  
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  grantOfflineAccess: function () {
    account.grantOfflineAccess();
  },

  signOut: function () {
    account.signOut(window.transition.to);
  },

  onEnter: function (event) {
    if (event.which === codes['ENTER']) {
      this.updateGreeting($(event.target));
    }
  },

  updateGreeting: function ($input) {
    this.model.set({ greeting: $input.val().trim() });
    $input.val('').blur();
  },

  postrender: function (options) {
    componentHandler.upgradeElements(this.el);
  }
  
});

},{"../../templates/account_card_template.html":35,"../classes/View.js":4,"../config/keycodes_config.json":6,"../singletons/account_singleton.js":25,"jquery":"jquery","underscore":"underscore"}],28:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var View = require('../classes/View.js');
var account = require('../singletons/account_singleton.js');

module.exports = View.extend({

  template: require('../../templates/account_link_template.html'),

  events: {
    'mouseup #transitionToAccount': 'transitionToAccount',
    'mouseup #signIn': 'signIn'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  transitionToAccount: function () {
    window.application.transition('account/' + this.model.id);
  },

  signIn: function () {
    account.signIn();
  },

  postrender: function (options) {
    componentHandler.upgradeElements(this.el);
  }

});

},{"../../templates/account_link_template.html":36,"../classes/View.js":4,"../singletons/account_singleton.js":25,"underscore":"underscore"}],29:[function(require,module,exports){
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

},{"../../templates/scroll_header_transparent_template.html":37,"../classes/View.js":4,"../handlers/account_card_handler.js":7,"../handlers/account_link_handler.js":8,"underscore":"underscore"}],30:[function(require,module,exports){
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

},{"../classes/View.js":4,"../handlers/account_page_handler.js":9,"../handlers/task_page_handler.js":12,"underscore":"underscore"}],31:[function(require,module,exports){
'use strict';

var View = require('../classes/View.js');

module.exports = View.extend({

  template: require('../../templates/tasks_card_template.html'),

  events: {
    'blur #inputTitle': 'updateTitle',
    'blur #inputDetails': 'updateDetails',
    'mouseup #delete': 'delete',
    'mouseup #toggleCompletion': 'toggleCompletion'
  },
  
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  updateTitle: function () {
    this.model.save({
      'title': this.$('#inputTitle').val().trim()
    });
  },

  updateDetails: function () {
    this.model.save({
      'details': this.$('#inputDetails').val().trim()
    });
  },

  toggleCompletion: function () {
    this.model.toggleCompletion();
  },

  delete: function () {
    this.model.destroy();
    this.remove();
    window.transition.back();
  },

  postrender: function (options) {
    componentHandler.upgradeElements(this.el);
  }
  
});

},{"../../templates/tasks_card_template.html":38,"../classes/View.js":4}],32:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var View = require('../classes/View.js');

module.exports = View.extend({

  template: require('../../templates/tasks_item_template.html'),

  events: {
    'mouseup #toggleCompletion': 'toggleCompletion',
    'mouseup #delete': 'delete'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  toggleCompletion: function () {
    this.model.toggleCompletion();
  },

  delete: function () {
    this.model.destroy();
    this.remove();
  },

  postrender: function (options) {
    componentHandler.upgradeElements(this.el);
  }
  
});

},{"../../templates/tasks_item_template.html":39,"../classes/View.js":4,"underscore":"underscore"}],33:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var View = require('../classes/View.js');
var codes = require('../config/keycodes_config.json');

var Task_Item_View = require('./Task_Item_View.js');

module.exports = View.extend({

  template: require('../../templates/tasks_list_template.html'),

  events: {
    'mouseup #toggleAllCompletion': 'toggleAllCompletion',
    'keyup #inputTitle': 'onEnter'
  },

  defaultViews: {
    '[data-region="list"]': 'buildList'
  },

  initialize: function () {

    this.listenTo(this.collection, 'change', this.render);
    
    window.remove = _.bind(this.remove, this);
    
    window.views = _.bind(function () {
      console.log(this.views);
    }, this);
  
  },

  buildList: function () {
    return this.collection.map(function (task) {
      return new Task_Item_View({ model: task });
    });
  },

  toggleAllCompletion: function () {

    // Coax into boolean flag
    var flag = !!this.collection.find(function (model) {
      return !model.get('completed');
    });

    // Set all true if any flag otherwise set all false
    this.collection.each(function (model) {
      model.complete(flag);
    });
  },

  onEnter: function (event) {
    if (event.which === codes['ENTER']) {
      this.appendItem();
    }
  },

  appendItem: function () {
    
    var $input = this.$('#inputTitle');
    
    var task = this.collection.create({
      'created': Date.now(),
      'title': $input.val().trim()
    }, {
      validate: true,
      wait: true,
      silent: true
    });

    if (!!task) {
      
      $input.val('').blur();

      this.$('.mdl-js-textfield')[0].MaterialTextfield.checkDirty();

      // Notice how a handler is not needed because the model is available
      var task_item_view = new Task_Item_View({ model: task });

      // Use the compositing functionality to append
      this.appendViews(task_item_view, '[data-region="list"]');

    }

  },

  postrender: function () {
    componentHandler.upgradeElements(this.el);  
  }

});

},{"../../templates/tasks_list_template.html":40,"../classes/View.js":4,"../config/keycodes_config.json":6,"./Task_Item_View.js":32,"underscore":"underscore"}],34:[function(require,module,exports){
'use strict';

var _ = require('underscore');

var View = require('../classes/View.js');

var account_link_handler = require('../handlers/account_link_handler.js');
var task_list_handler = require('../handlers/task_list_handler.js');
var task_card_handler = require('../handlers/task_card_handler.js');

module.exports = View.extend({

  template: require('../../templates/scroll_header_transparent_template.html'),

  defaultViews: {
    '[data-region="header"]': account_link_handler
  },

  setTaskListView: function () {

    var task_list_view = task_list_handler();

    this.setViews(task_list_view, '[data-region="content"]');

  },

  setTaskCardView: function (id) {

    var task_card_view = task_card_handler(id);

    this.setViews(task_card_view, '[data-region="content"]');

  },

  postrender: function () {

    componentHandler.upgradeElements(this.el);
  
  }

});

},{"../../templates/scroll_header_transparent_template.html":37,"../classes/View.js":4,"../handlers/account_link_handler.js":8,"../handlers/task_card_handler.js":10,"../handlers/task_list_handler.js":11,"underscore":"underscore"}],35:[function(require,module,exports){
module.exports = "<div class=\"app\">\n  <div class=\"mdl-card mdl-shadow--2dp\">\n    <div class=\"mdl-card__menu\">\n      <button class=\"mdl-button mdl-js-button mdl-button--icon\">\n        <% if (state('pending')) {%>\n        <div class=\"mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active\"></div>\n        <% } else if (state('resolved') && rid()) { %>\n        <img src=<%= get('image_url') %> width=\"32px\" height=\"32px\" />\n        <% } %>\n      </button>\n    </div>\n\n    <% if (state('pending')) { %>\n    <div class=\"mdl-card__title\">\n      <h2 class=\"mdl-card__title-text\">Initializing <%- get('provider') %>...</h2>\n    </div>\n    <% } else if (state('resolved') && rid()) { %>\n    <div class=\"mdl-card__supporting-text\">\n      <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n        <input class=\"mdl-textfield__input\" type=\"text\" disabled>\n        <label class=\"mdl-textfield__label\"><%- get('name') %></label>\n      </div>\n      <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n        <input class=\"mdl-textfield__input\" type=\"text\" disabled>\n        <label class=\"mdl-textfield__label\"><%- get('email') %></label>\n      </div>\n      <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n        <input class=\"mdl-textfield__input\" type=\"text\" disabled>\n        <label class=\"mdl-textfield__label\"><%- get('provider') %> Account</label>\n      </div>\n      <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n        <input class=\"mdl-textfield__input\" type=\"text\" id=\"inputGreeting\" length=\"23\">\n        <label class=\"mdl-textfield__label\"><%- get('greeting') %></label>\n      </div>\n    </div>\n    <% } %>\n\n    <div class=\"mdl-card__actions mdl-card--border\">\n      <button href=\"/<\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n        <i class=\"material-icons\">arrow_back</i>\n      </button>\n      <button href=\"/\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n        <i class=\"material-icons\">home</i>\n      </button>\n      <% if (state('resolved') && rid()) { %>\n      <a id=\"grantOfflineAccess\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\">\n        Grant offline access\n      </a>\n      <a id=\"signOut\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\">Sign out</a>\n      <% } %>\n    </div>\n  </div>\n</div>";

},{}],36:[function(require,module,exports){
module.exports = "<a class=\"mdl-navigation__link\">\n  <% if (state('pending')) {%>\n  Initializing <%- get('provider') %>...\n  <% } else if (state('resolved') && rid()) { %>\n    <%- get('greeting') %>, <%- get('name').split(' ', 1)[0] %>&nbsp;&nbsp;&nbsp;\n  <% } %>\n  <button <% if(rid()) { %> href=\"/account/<%= rid() %>\" <% } else { %> id=\"signIn\" <% } %> class=\"mdl-button mdl-js-button mdl-button--icon\">\n    <% if (state('pending')) {%>\n    <div class=\"mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active\"></div>\n    <% } else if (state('resolved') && has('id')) { %>\n    <img src=<%= get('image_url') %> width=\"32px\" height=\"32px\" />\n    <% } else { %>\n    <i id=\"icon\" class=\"material-icons\">fingerprint</i>\n    <% } %>\n  </button>\n</a>\n";

},{}],37:[function(require,module,exports){
module.exports = "<div>\n  <div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-header\">\n    <header class=\"mdl-layout__header mdl-layout__header--scroll mdl-layout__header--transparent\">\n      <div class=\"mdl-layout__header-row\">\n        <!-- <span class=\"mdl-layout-title\">Title</span> -->\n        <div class=\"mdl-layout-spacer\"></div>\n        <nav class=\"mdl-navigation mdl-layout--large-screen-only\" data-region=\"header\"></nav>\n      </div>\n    </header>\n    <main class=\"mdl-layout__content\">\n      <div class=\"page-content\" data-region=\"content\"></div>\n    </main>\n    <div data-region=\"footer\"></div>\n  </div>\n</div>";

},{}],38:[function(require,module,exports){
module.exports = "<div class=\"app\">\n  <div class=\"mdl-card mdl-shadow--2dp\">\n    <div class=\"mdl-card__menu\">\n      <i class=\"material-icons\"><% has('completed') ? print('check_box') : print('check_box_outline_blank') %></i>\n    </div>\n    <div class=\"mdl-card__title\"></div>\n    <div class=\"mdl-card__supporting-text\">\n      <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n        <input class=\"mdl-textfield__input\" type=\"text\" id=\"inputTitle\" length=\"23\" <% has('completed') && print('disabled')%> >\n        <label class=\"mdl-textfield__label\" for=\"inputTitle\"><%- get('title') %></label>\n      </div>\n      <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n        <textarea class=\"mdl-textfield__input\" type=\"text\" rows= \"1\" id=\"inputDetails\" <% has('completed') && print('disabled')%>></textarea>\n        <label class=\"mdl-textfield__label\" for=\"inputDetails\"><% has('details') ? print(get('details')) : print(\"Add details\") %></label>\n      </div>\n    </div>\n    <div class=\"mdl-card__actions mdl-card--border\">\n      <button href=\"/<\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n        <i class=\"material-icons\">arrow_back</i>\n      </button>\n      <button href=\"/\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n        <i class=\"material-icons\">home</i>\n      </button>\n      <a id=\"delete\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\">\n        Delete\n      </a>\n      <a id=\"toggleCompletion\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\">\n        Toggle Completion\n      </a>\n    </div>\n  </div>\n</div>\n";

},{}],39:[function(require,module,exports){
module.exports = "<li>\n  <div class=\"mdl-card mdl-shadow--2dp\">\n    <div class=\"mdl-card__supporting-text\">\n    <div class=\"avatar-wrapper left right\">\n      <div class=\"avatar left\">\n        <label id=\"toggleCompletion\" class=\"mdl-checkbox mdl-js-checkbox\" for=\"checkbox-<%- get('id') %>\">\n          <input type=\"checkbox\" id=\"checkbox-<%- get('id') %>\" class=\"mdl-checkbox__input\" <% has('completed') && print('checked') %>>\n        </label>\n      </div>\n      <p href=\"/task/<%- rid() %>\" class=\"task <% has('completed') && print('completed') %>\"><%- get('title') %></p>\n      <span>\n        <% has('details') && print(get('details'), '<br>') %>\n        <% print(format('created'), '<br>') %>\n        <% has('due') && print(format('due'), '<br>') %>\n        <% has('completed') && print(format('completed')) %>\n      </span>\n      <div class=\"avatar right\">\n        <button id=\"delete\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n          <i class=\"material-icons\">delete</i>\n        </button>\n      </div>\n    </div>\n    </div>\n  </div>\n</li>";

},{}],40:[function(require,module,exports){
module.exports = "<div class=\"app\">\n  <div class=\"avatar-wrapper right\">\n    <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n      <input class=\"mdl-textfield__input\" type=\"text\" id=\"inputTitle\" length=\"23\">\n      <label class=\"mdl-textfield__label\" for=\"inputTitle\">What needs to be done?</label>\n    </div>\n    <div class=\"avatar-fab right\">\n      <button id=\"toggleAllCompletion\" class=\"mdl-button mdl-js-button mdl-button--fab\">\n        <i class=\"material-icons\">done_all</i>\n      </button>\n    </div>\n  </div>\n  <% if (state('pending')) {%>\n  <div class=\"mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active\"></div>\n  <% } else if (state('resolved')) { %>\n  <ul data-region=\"list\"></ul>\n  <% } %>\n</div>\n";

},{}]},{},[19]);
