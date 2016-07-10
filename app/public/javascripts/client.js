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

},{"../helpers/collection_helpers.js":14,"backbone":"backbone","underscore":"underscore"}],2:[function(require,module,exports){
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

},{"../helpers/router_helpers.js":17,"backbone":"backbone","underscore":"underscore"}],4:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var backbone = require('backbone');
var helpers = require('../helpers/view_helpers.js');
var create = _.isFunction(Object.create) ? Object.create : _.create;

var View = module.exports = function (options) {
  this.children = {};
  backbone.View.apply(this, arguments);
}

View.prototype = create(backbone.View.prototype);

_.extend(View.prototype, helpers);

View.extend = backbone.View.extend;

},{"../helpers/view_helpers.js":18,"backbone":"backbone","underscore":"underscore"}],5:[function(require,module,exports){
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

},{"../singletons/tasks_singleton.js":26,"../views/Task_Card_View.js":30}],11:[function(require,module,exports){
'use strict';

var Task_Item_View = require('../views/Task_Item_View.js');

var tasks = require('../singletons/tasks_singleton.js');

module.exports = function (id, options) {
  
  var task = tasks.lookup(id);

  var task_item_view = new Task_Item_View({ model: task });

  return task_item_view;

}

},{"../singletons/tasks_singleton.js":26,"../views/Task_Item_View.js":31}],12:[function(require,module,exports){
'use strict';

var Task_List_View = require('../views/Task_List_View.js');

var tasks = require('../singletons/tasks_singleton.js');

module.exports = function () {

  tasks.fetch();

  var task_list_view = new Task_List_View({ collection: tasks });

  return task_list_view;
  
}
},{"../singletons/tasks_singleton.js":26,"../views/Task_List_View.js":32}],13:[function(require,module,exports){
'use strict';

var Task_Page_View = require('../views/Task_Page_View.js');

module.exports = function () {

  var task_page_view = new Task_Page_View();

  return task_page_view;
  
}

},{"../views/Task_Page_View.js":33}],14:[function(require,module,exports){
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
},{"backbone":"backbone","jquery":"jquery"}],15:[function(require,module,exports){
'use strict';

var backbone = require('backbone');
module.exports = {

  sync: function () {
    return this.promise = backbone.Model.prototype.sync.apply(this, arguments);
  }
  
}

},{"backbone":"backbone"}],16:[function(require,module,exports){
var _ = require('underscore');

// Import this within a context to return a closure
module.exports = function () {
  
  // Using eval so that resource may be deleted
  // http://perfectionkills.com/understanding-delete/
  eval('var resource = this;');

  return {

    id: function () {
      return resource.id;
    },

    get: function (key) {
      return resource.get(key);
    },

    has: function (key) {
      return (!!resource.get(key));
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
    },

    release: function () {
      console.log('Releasing the context closure on the resource.');
      delete resource;
    }

  }
}

},{"underscore":"underscore"}],17:[function(require,module,exports){
'use strict';

var backbone = require('backbone');

module.exports = {
  
  transition: function (fragment) {
    backbone.Router.prototype.navigate.call(this, fragment, true);
  },

  back: function () {
    window.history.back();
  },

  forward: function () {
    window.history.forward();
  }

}

},{"backbone":"backbone"}],18:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var _ = require('underscore');
var backbone = require('backbone');
var closure = require('./presenter_helpers.js');

module.exports = {

  // Abstract renderer w/ minimal memory management
  append: function (child, selector, options) {

    // Child view removes itself upon parent view removal
    var remove_child = _.bind(child.remove, child);
    child.listenTo(this, 'remove', remove_child);

    // Parent view deletes reference upon child view removal
    this.listenTo(child, 'remove', function () {

      console.log('removing child')

      var index = _.indexOf(this.children[selector], child);

      !! index && 
        (this.children[selector] = this.children[selector].slice(index, 1));

      this.stopListening(child);

      //console.log(this.children);
    
    });

    this.children[selector] = this.children[selector] || [];

    this.children[selector].push(child);

    child.render(options).$el.appendTo(this.$(selector));

    return this;

  },

  insert: function(child, selector, options) {

    var region_is_active = _.has(this.children, selector);
    
    region_is_active && _.each(this.children[selector], function (child) {

      child.remove();
    
    });

    return this.append.apply(this, arguments);

  },

  remove: function () {

    var options = _.last(arguments) || {};

    $.Deferred().resolveWith(this)

    .then(function () {
      this.trigger('preremove', options);
      _.isFunction(this.preremove)
        && this.preremove(options);
    })
    
    .then(function () {

      // Make children remove themselves
      this.trigger('remove', options);

      // Release the resource's context to be safe
      !!this.presenter
        && this.presenter.release();

      // Detach from the DOM
      backbone.View.prototype.remove.apply(this, arguments);

    })
    
    .then(function () {
      this.trigger('postremove', options);
      _.isFunction(this.postremove)
        && this.postremove(options);
    });

    return this;

  },

  resource: function () {
    return this.model || this.collection || {};
  },

  // Build template using its presenter
  compile: function () {

    // Get cached presenter or create a new one
    this.presenter = this.presenter
      || closure.call(this.resource());

    // Allow overriding of underscore's templater
    this.engine = _.isFunction(this.engine)
      ? this.engine
      : _.template;

    var template = this.engine(this.template)(this.presenter);
    
    this.$template = $(template);
    
    if (!this.rendered) {
      this.setElement(this.$template);
      this.rendered = true;
    }

    else this.$el.html(this.$template.html());

    return this;

  },

  render: function () {

    var options = _.last(arguments) || {};
    
    $.Deferred().resolveWith(this)

    .then(function () {
      this.trigger('prerender', options);
      _.isFunction(this.prerender)
        && this.prerender(options);
    })

    .then(function () {
      this.compile(options);
      this.trigger('render', options);
    })

    .then(function () {
      this.trigger('postrender', options);
      _.isFunction(this.postrender)
        && this.postrender(options);
    });
    
    return this;
  
  }

}

},{"./presenter_helpers.js":16,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],19:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var backbone = require('backbone');
backbone.LocalStorage = require('backbone.localstorage');
var ApplicationRouter = require('./routers/Application_Router.js');

$(function() {

  window.application = new ApplicationRouter();

  // TODO:
  // Using { pushState: true } requires thought-out server
  backbone.history.start(); 

});

},{"./routers/Application_Router.js":24,"backbone":"backbone","backbone.localstorage":"backbone.localstorage","jquery":"jquery"}],20:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var backbone = require('backbone');
var Model = require('../classes/Model.js');

module.exports = Model.extend({

  defaults: {
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

    this.set('provider', 'Google');

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

    if (user.isSignedIn()) {

      var profile = user.getBasicProfile();
    
      this.set({
        'id': profile.getId(),
        'name': profile.getName(),
        'image_url': profile.getImageUrl(),
        'email': profile.getEmail()
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

var backbone = require('backbone');
var Collection = require('../classes/Collection.js');

module.exports = Collection.extend({

  model: require('./Tasks_Model.js'),
  
  localStorage: new backbone.LocalStorage('TasksApp')

});

},{"../classes/Collection.js":1,"./Tasks_Model.js":23,"backbone":"backbone"}],23:[function(require,module,exports){
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

},{"../classes/Model.js":2,"backbone":"backbone","underscore":"underscore"}],24:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var Router = require('../classes/Router.js');

var task_page_controller = require('../controllers/task_page_controller.js');
var account_page_controller = require('../controllers/account_page_controller.js');

module.exports = Router.extend({

  active_view: undefined,

  routes: {
  
    '': 'index',

    'task/:id': 'task',
    
    'account/:id': 'account'
  
  },

  index: function () {

    var task_page_view = task_page_controller();

    this.active_view && this.active_view.remove();

    this.active_view = task_page_view;

    task_page_view.render().$el.appendTo($('[data-region="application"]'));

    task_page_view.insertList();

  },

  task: function (id) {

    var task_page_view = task_page_controller();

    this.active_view && this.active_view.remove();

    this.active_view = task_page_view;

    task_page_view.render().$el.appendTo($('[data-region="application"]'));

    task_page_view.insertCard(id);
    
  },

  account: function () {

    var account_page_view = account_page_controller();

    this.active_view && this.active_view.remove();

    this.active_view = account_page_view;

    account_page_view.render().$el.appendTo($('[data-region="application"]'));

    account_page_view.insertCard();
    
  }

});

},{"../classes/Router.js":3,"../controllers/account_page_controller.js":9,"../controllers/task_page_controller.js":13,"jquery":"jquery"}],25:[function(require,module,exports){
'use strict';

var GoogleAccountModel = require('../models/Google_Account_Model.js');

module.exports =  new GoogleAccountModel();

},{"../models/Google_Account_Model.js":21}],26:[function(require,module,exports){
'use strict';

var TasksCollection = require('../models/Tasks_Collection.js');

module.exports = new TasksCollection();

},{"../models/Tasks_Collection.js":22}],27:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var _ = require('underscore');
var View = require('../classes/View.js');
var account = require('../singletons/account_singleton.js');
var codes = require('../config/keycodes_config.json');

module.exports = View.extend({

  template: require('../../templates/account_card_template.html'),

  events: {
    'mouseup #transitionBack': 'transitionBack',
    'mouseup #transitionHome': 'transitionHome',
    'mouseup #grantOfflineAccess': 'grantOfflineAccess',
    'mouseup #signOut': 'signOut',
    'keyup #inputGreeting': 'onEnter'

  },
  
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  transitionBack: function () {
    window.application.back();
  },

  transitionHome: function () {
    window.application.transition('');
  },

  grantOfflineAccess: function () {
    account.grantOfflineAccess();
  },

  signOut: function () {
    account.signOut(this.transitionHome);
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
    options.animate && this.$el.hide().fadeIn();
    componentHandler.upgradeElements(this.el);
  }
  
});

},{"../../templates/account_card_template.html":34,"../classes/View.js":4,"../config/keycodes_config.json":6,"../singletons/account_singleton.js":25,"jquery":"jquery","underscore":"underscore"}],28:[function(require,module,exports){
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
    options.animate && this.$el.hide().fadeIn();
    componentHandler.upgradeElements(this.el);
  }

});

},{"../../templates/account_link_template.html":35,"../classes/View.js":4,"../singletons/account_singleton.js":25,"underscore":"underscore"}],29:[function(require,module,exports){
'use strict';

var _ = require('underscore');

var View = require('../classes/View.js');

var account_link_controller = require('../controllers/account_link_controller.js');
var account_card_controller = require('../controllers/account_card_controller.js');

module.exports = View.extend({

  template: require('../../templates/scroll_header_transparent_template.html'),

  insertCard: function () {
    var account_card_view = account_card_controller();
    this.insert(account_card_view, '[data-region="content"]');
  },

  postrender: function (options) {
    var account_link_view = account_link_controller();
    this.append(account_link_view, '[data-region="header"]');
    componentHandler.upgradeElements(this.el);
  }

});

},{"../../templates/scroll_header_transparent_template.html":36,"../classes/View.js":4,"../controllers/account_card_controller.js":7,"../controllers/account_link_controller.js":8,"underscore":"underscore"}],30:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var View = require('../classes/View.js');

module.exports = View.extend({

  template: require('../../templates/tasks_card_template.html'),

  events: {
    'blur #inputTitle': 'updateTitle',
    'blur #inputDetails': 'updateDetails',
    'mouseup #transitionBack': 'transitionBack',
    'mouseup #transitionHome': 'transitionHome',
    'mouseup #delete': 'delete',
    'mouseup #toggleCompletion': 'toggleCompletion'
  },
  
  initialize: function () {
    // May need to _.debounce render
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

  transitionBack: function () {
     window.transition.back();
  },

  transitionHome: function () {
    window.application.transition(''); // no-op if on same route
    //window.transition.routes['']();
  },

  delete: function () {
    this.model.destroy();
    this.remove();
    this.transitionBack();
  },

  postrender: function (options) {
    options.animate && this.$el.hide().fadeIn();
    componentHandler.upgradeElements(this.el);
  }
  
});

},{"../../templates/tasks_card_template.html":37,"../classes/View.js":4,"underscore":"underscore"}],31:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var View = require('../classes/View.js');

module.exports = View.extend({

  template: require('../../templates/tasks_item_template.html'),

  events: {
    'mouseup #toggleCompletion': 'toggleCompletion',
    'mouseup #transitionToTask': 'transitionToTask',
    'mouseup #delete': 'delete'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  toggleCompletion: function () {
    this.model.toggleCompletion();
  },

  transitionToTask: function () {
    window.application.transition('task/' + this.model.id); // no-op if on same route
    //window.transition.routes['tasks/:id'](this.model.id);
  },

  delete: function () {
    this.model.destroy();
    this.remove();
  },

  postrender: function (options) {
    options.animate && this.$el.hide().fadeIn();
    componentHandler.upgradeElements(this.el);
  }
  
});

},{"../../templates/tasks_item_template.html":38,"../classes/View.js":4,"underscore":"underscore"}],32:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var View = require('../classes/View.js');
var codes = require('../config/keycodes_config.json');

var task_item_controller = require('../controllers/task_item_controller.js');

module.exports = View.extend({

  template: require('../../templates/tasks_list_template.html'),

  events: {
    'mouseup #toggleAllCompletion': 'toggleAllCompletion',
    'keyup #inputTitle': 'onEnter'
  },

  initialize: function () {
    this.listenTo(this.collection, 'change', this.render);
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

      var task_item_view = task_item_controller(task.id);

      this.append(task_item_view, '[data-region="list"]');

    }
  },

  postrender: function (options) {

    this.collection.each(function (task) {

      var task_item_view = task_item_controller(task.id);

      this.append(task_item_view, '[data-region="list"]');

    }, this);

    options.animate && this.$('[data-region="list"]').hide().fadeIn();

    componentHandler.upgradeElements(this.el);
  
  }

});

},{"../../templates/tasks_list_template.html":39,"../classes/View.js":4,"../config/keycodes_config.json":6,"../controllers/task_item_controller.js":11,"underscore":"underscore"}],33:[function(require,module,exports){
'use strict';

var _ = require('underscore');

var View = require('../classes/View.js');

var account_link_controller = require('../controllers/account_link_controller.js');
var task_list_controller = require('../controllers/task_list_controller.js');
var task_card_controller = require('../controllers/task_card_controller.js');

module.exports = View.extend({

  template: require('../../templates/scroll_header_transparent_template.html'),

  insertList: function () {
    var task_list_view = task_list_controller();
    this.insert(task_list_view, '[data-region="content"]');
  },

  insertCard: function (id) {
    var task_card_view = task_card_controller(id);
    this.insert(task_card_view, '[data-region="content"]');
  },

  postrender: function (options) {
    var account_link_view = account_link_controller();
    this.append(account_link_view, '[data-region="header"]');
    componentHandler.upgradeElements(this.el);
  }

});

},{"../../templates/scroll_header_transparent_template.html":36,"../classes/View.js":4,"../controllers/account_link_controller.js":8,"../controllers/task_card_controller.js":10,"../controllers/task_list_controller.js":12,"underscore":"underscore"}],34:[function(require,module,exports){
module.exports = "<div class=\"app\">\n  <div class=\"mdl-card mdl-shadow--2dp\">\n    <div class=\"mdl-card__menu\">\n      <button class=\"mdl-button mdl-js-button mdl-button--icon\">\n        <% if (state('pending')) {%>\n        <div class=\"mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active\"></div>\n        <% } else if (state('resolved') && has('id')) { %>\n        <img src=<%= get('image_url') %> width=\"32px\" height=\"32px\" />\n        <% } %>\n      </button>\n    </div>\n\n    <% if (state('pending')) { %>\n    <div class=\"mdl-card__title\">\n      <h2 class=\"mdl-card__title-text\">Initializing <%- get('provider') %>...</h2>\n    </div>\n    <% } else if (state('resolved') && has('id')) { %>\n    <div class=\"mdl-card__supporting-text\">\n      <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n        <input class=\"mdl-textfield__input\" type=\"text\" disabled>\n        <label class=\"mdl-textfield__label\"><%- get('name') %></label>\n      </div>\n      <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n        <input class=\"mdl-textfield__input\" type=\"text\" disabled>\n        <label class=\"mdl-textfield__label\"><%- get('email') %></label>\n      </div>\n      <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n        <input class=\"mdl-textfield__input\" type=\"text\" id=\"inputGreeting\" length=\"23\">\n        <label class=\"mdl-textfield__label\"><%- get('greeting') %></label>\n      </div>\n    </div>\n    <% } %>\n\n    <div class=\"mdl-card__actions mdl-card--border\">\n      <button id=\"transitionBack\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n        <i class=\"material-icons\">arrow_back</i>\n      </button>\n      <button id=\"transitionHome\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n        <i class=\"material-icons\">home</i>\n      </button>\n      <% if (state('resolved') && has('id')) { %>\n      <a id=\"grantOfflineAccess\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\">\n        Grant offline access\n      </a>\n      <a id=\"signOut\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\">Sign out</a>\n      <% } %>\n    </div>\n  </div>\n</div>";

},{}],35:[function(require,module,exports){
module.exports = "<a class=\"mdl-navigation__link\">\n  <% if (state('pending')) {%>\n  Initializing <%- get('provider') %>...\n  <% } else if (state('resolved') && has('id')) { %>\n    <%- get('greeting') %>, <%- get('name').split(' ', 1)[0] %>&nbsp;&nbsp;&nbsp;\n  <% } %>\n  <button id=\"<% has('id') ? print('transitionToAccount') : print('signIn') %>\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n    <% if (state('pending')) {%>\n    <div class=\"mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active\"></div>\n    <% } else if (state('resolved') && has('id')) { %>\n    <img src=<%= get('image_url') %> width=\"32px\" height=\"32px\" />\n    <% } else { %>\n    <i id=\"icon\" class=\"material-icons\">fingerprint</i>\n    <% } %>\n  </button>\n</a>\n";

},{}],36:[function(require,module,exports){
module.exports = "<div>\n  <div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-header\">\n    <header class=\"mdl-layout__header mdl-layout__header--scroll mdl-layout__header--transparent\">\n      <div class=\"mdl-layout__header-row\">\n        <!-- <span class=\"mdl-layout-title\">Title</span> -->\n        <div class=\"mdl-layout-spacer\"></div>\n        <nav class=\"mdl-navigation mdl-layout--large-screen-only\" data-region=\"header\"></nav>\n      </div>\n    </header>\n    <main class=\"mdl-layout__content\">\n      <div class=\"page-content\" data-region=\"content\"></div>\n    </main>\n    <div data-region=\"footer\"></div>\n  </div>\n</div>";

},{}],37:[function(require,module,exports){
module.exports = "<div class=\"app\">\n  <div class=\"mdl-card mdl-shadow--2dp\">\n    <div class=\"mdl-card__menu\">\n      <i class=\"material-icons\"><% has('completed') ? print('check_box') : print('check_box_outline_blank') %></i>\n    </div>\n    <div class=\"mdl-card__title\"></div>\n    <div class=\"mdl-card__supporting-text\">\n      <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n        <input class=\"mdl-textfield__input\" type=\"text\" id=\"inputTitle\" length=\"23\" <% has('completed') && print('disabled')%> >\n        <label class=\"mdl-textfield__label\" for=\"inputTitle\"><%- get('title') %></label>\n      </div>\n      <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n        <textarea class=\"mdl-textfield__input\" type=\"text\" rows= \"1\" id=\"inputDetails\" <% has('completed') && print('disabled')%>></textarea>\n        <label class=\"mdl-textfield__label\" for=\"inputDetails\"><% has('details') ? print(get('details')) : print(\"Add details\") %></label>\n      </div>\n    </div>\n    <div class=\"mdl-card__actions mdl-card--border\">\n      <button id=\"transitionBack\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n        <i class=\"material-icons\">arrow_back</i>\n      </button>\n      <button id=\"transitionHome\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n        <i class=\"material-icons\">home</i>\n      </button>\n      <a id=\"delete\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\">\n        Delete\n      </a>\n      <a id=\"toggleCompletion\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\">\n        Toggle Completion\n      </a>\n    </div>\n  </div>\n</div>\n";

},{}],38:[function(require,module,exports){
module.exports = "<li>\n  <div class=\"mdl-card mdl-shadow--2dp\">\n    <div class=\"mdl-card__supporting-text\">\n    <div class=\"avatar-wrapper left right\">\n      <div class=\"avatar left\">\n        <label id=\"toggleCompletion\" class=\"mdl-checkbox mdl-js-checkbox\" for=\"checkbox-<%- get('id') %>\">\n          <input type=\"checkbox\" id=\"checkbox-<%- get('id') %>\" class=\"mdl-checkbox__input\" <% has('completed') && print('checked') %>>\n        </label>\n      </div>\n      <p id=\"transitionToTask\" class=\"<% has('completed') && print('completed') %>\"><%- get('title') %></p>\n      <span>\n        <% has('details') && print(get('details'), '<br>') %>\n        <% print(format('created'), '<br>') %>\n        <% has('due') && print(format('due'), '<br>') %>\n        <% has('completed') && print(format('completed')) %>\n      </span>\n      <div class=\"avatar right\">\n        <button id=\"delete\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n          <i class=\"material-icons\">delete</i>\n        </button>\n      </div>\n    </div>\n    </div>\n  </div>\n</li>";

},{}],39:[function(require,module,exports){
module.exports = "<div class=\"app\">\n  <div class=\"avatar-wrapper right\">\n    <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n      <input class=\"mdl-textfield__input\" type=\"text\" id=\"inputTitle\" length=\"23\">\n      <label class=\"mdl-textfield__label\" for=\"inputTitle\">What needs to be done?</label>\n    </div>\n    <div class=\"avatar-fab right\">\n      <button id=\"toggleAllCompletion\" class=\"mdl-button mdl-js-button mdl-button--fab\">\n        <i class=\"material-icons\">done_all</i>\n      </button>\n    </div>\n  </div>\n  <% if (state('pending')) {%>\n  <div class=\"mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active\"></div>\n  <% } else if (state('resolved')) { %>\n  <ul data-region=\"list\"></ul>\n  <% } %>\n</div>\n";

},{}]},{},[19]);
