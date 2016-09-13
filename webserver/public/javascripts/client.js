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

},{"../helpers/collection_helpers.js":5,"backbone":"backbone","underscore":"underscore"}],2:[function(require,module,exports){
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

},{"../helpers/model_helpers.js":7,"backbone":"backbone","underscore":"underscore"}],3:[function(require,module,exports){
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

},{"../helpers/router_helpers.js":9,"backbone":"backbone","underscore":"underscore"}],4:[function(require,module,exports){
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

},{"../helpers/composite_helpers.js":6,"../helpers/render_helpers.js":8,"backbone":"backbone","underscore":"underscore"}],5:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var backbone = require('backbone');

module.exports = {

  sync: function (method, model, options) {

    // Reset the promise
    this.promise = $.Deferred();

    return this.promise = backbone.Collection.prototype.sync.apply(this, arguments);

  },

  isPending: function () {
    return !! this.promise && this.promise.state() === 'pending';
  },

  isResolved: function () {
    return !! this.promise && this.promise.state() === 'resolved';
  },

  // TODO: 3 layer lookup local, cache, server
  // https://youtu.be/P0YIdsJqKV4
  lookup: function (itemid, options) {

    var model;

    // Find model in local collection
    if (model = this.get(itemid)) {

      options = options || {};

      if (!!options.update) model.fetch(options);

      // Set it resolved on the model for presenter/template logic
      else model.promise = $.Deferred().resolve(model).promise();

    }

    // TODO: Try to find cached model in local storage
    // else if () {}

    // Fetch from server
    else {

      // First create an instance and fetch it
      model = this.add({ id : itemid });

      // Fetch from cache
      model.fetch(options);

    }

    return model;

  }

}

},{"backbone":"backbone","jquery":"jquery"}],6:[function(require,module,exports){
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

    _.chain(this.views).keys().each(function (selector) {

      this.freeViews(selector);

    }, this);

  },

  // Needs work
  // Check the child is an instance of ViewCtor
  //isInstanceof: function (selector, ViewCtor) {
  //  return this.views[selector] instanceof ViewCtor;
  //},

  // Needs work
  // Check if the compositor has any instance of ViewCtor
  //hasInstanceOf: function (ViewCtor) {
  //  return _.find(this.views, function (view) {
  //    return view instanceof ViewCtor;
  //  });
  //},

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

  setView: function (set, selector) {

    set = _.isArray(set) ? set : [set];

    this.setViews(set, selector);

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

      this.setView(set, selector);

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
},{"jquery":"jquery","underscore":"underscore"}],7:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var backbone = require('backbone');

module.exports = {

  sync: function (method, model, options) {

    // Reset the promise
    this.promise = $.Deferred();

    return this.promise = backbone.Model.prototype.sync.apply(this, arguments);

  },

  isPending: function () {
    return !! this.promise && this.promise.state() === 'pending';
  },

  isResolved: function () {
    return !! this.promise && this.promise.state() === 'resolved';
  }
  
}

},{"backbone":"backbone","jquery":"jquery"}],8:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var backbone = require('backbone');

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

    if (this.template) {

      // Allow overriding of underscore's templater
      var engine = _.isFunction(this.engine)
        ? this.engine
        : _.template;

      var resource = this.resource();

      // Compile the template w/ the resource
      var template = engine(this.template)(resource);
      
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

    }

    // TODO:
    // Clean this code up
    else {

      if (!this.rendered) {
        this.rendered = true;
        this.trigger('init:render');
      }

      else {
        this.trigger('re:render');
      }

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

},{"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],9:[function(require,module,exports){
'use strict';

var backbone = require('backbone');

module.exports = {
  
  to: function (fragment) {
    fragment = fragment || '';
    if (fragment === '<') this.back();
    else if (fragment === '>') this.forward();
    else backbone.Router.prototype.navigate.call(this, fragment, true);
  },

  back: function () {
    window.history.back();
  },

  forward: function () {
    window.history.forward();
  }

}

},{"backbone":"backbone"}],10:[function(require,module,exports){
module.exports={
  "client_id": "942671175535-e5rg5spr5pobm1tqai0m2l3jokvpb9q8.apps.googleusercontent.com",
  "redirect_uri": "postmessage"
}
},{}],11:[function(require,module,exports){
module.exports={
  "ENTER": 13
}
},{}],12:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var AccountPage = require('../views/Account_Page.js');

var $region = $('body');

module.exports = function (options) {

  this.authenticate()

  .done(function(account) {

    options = options || {};

    // Do this first so events aren't caught on old view
    if (this.active) this.active.remove();

    var account = require('../singletons/account_singleton.js');

    // Fetch before view creation so that it misses the request event
    var accountPage = new AccountPage({ model: account });

    this.active = accountPage;

    accountPage.render().$el.appendTo($region);

  })

  .fail(function (account) {

    //console.log("Not signed in...");

    this.to('login');
  
  });

}

},{"../singletons/account_singleton.js":22,"../views/Account_Page.js":25,"jquery":"jquery"}],13:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var LoginPage = require('../views/Login_Page.js');

var $region = $('body');

module.exports = function (options) {

  this.authenticate()

  .done(function() {

    //console.log("Signed in...");

    this.to('');

  })

  .fail(function (account) {

    // Do this first so events aren't caught on old view
    if (this.active) this.active.remove();

    var loginPage = new LoginPage({ model: account });

    this.active = loginPage;

    loginPage.render().$el.appendTo($region);
  
  });

}
},{"../views/Login_Page.js":27,"jquery":"jquery"}],14:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var TaskPage = require('../views/Task_Page.js');

var $region = $('body');

module.exports = function (id, options) {

  this.authenticate().

  done(function(account) {

    // Do this first so events aren't caught on old view
    if (this.active) this.active.remove();

    var tasks = require('../singletons/tasks_singleton.js');

    var task = tasks.lookup(id);

    var taskPage = new TaskPage({ model: task });

    this.active = taskPage;

    taskPage.render().$el.appendTo($region);

  }).

  fail(function (account) {

    console.log("Not signed in...");

    this.to('login');
  
  });

}

},{"../singletons/tasks_singleton.js":23,"../views/Task_Page.js":30,"jquery":"jquery"}],15:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var TasksPage = require('../views/Tasks_Page.js');

var $region = $('body');

module.exports = function (options) {

  this.authenticate()

  .done(function(account) {

    options = options || {};

    // Do this first so events aren't caught on old view
    if (this.active) this.active.remove();

    var tasks = require('../singletons/tasks_singleton.js');

    tasks.fetch();

    var tasksPage = new TasksPage({ collection: tasks });

    this.active = tasksPage;

    tasksPage.render().$el.appendTo($region);

  })

  .fail(function (account) {

    //console.log("Not signed in...");

    this.to('login');
  
  });

}

},{"../singletons/tasks_singleton.js":23,"../views/Tasks_Page.js":33,"jquery":"jquery"}],16:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var backbone = require('backbone');
backbone.LocalStorage = require('backbone.localstorage');
var Router = require('./routers/');

$(function() {

  window.transition = new Router();

  $(document).on('click', '[href^="/"]', function (event) {

    var href = $(event.currentTarget).attr('href')

    !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey
      && event.preventDefault();

    var fragment = href.replace(/^\//, '').replace('\#\!\/', '');

    window.transition.to(fragment);

    return false

  });

  backbone.history.start({ pushState: true }); 

});

},{"./routers/":20,"backbone":"backbone","backbone.localstorage":"backbone.localstorage","jquery":"jquery"}],17:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var Model = require('../../../architecture/classes/Model.js');

var config = require('../config/google.json');

var gAuth = require('../services/gAuth.js');

module.exports = Model.extend({

  defaults: {
    'id': undefined,
    'name': undefined,
    'image_url': undefined,
    'email': undefined,
    'provider': undefined,
    'signed_in': false,
    'fully_signed_in': false,
    'provider': 'Google'
  },

  clear : function (options) {
    this.promise = $.Deferred();
    Model.prototype.clear.call(this, options);
  },

  isSignedIn: function () {
    return !! this.get('signed_in');
  },

  isFullySignedIn: function () {
    return !! this.get('fully_signed_in');
  },

  getImageUrl: function () {
    return this.get('image_url'); 
  },

  setUserAttributes: function (user) {

    this.set(this.defaults, { silent: true });

    if (user.isSignedIn()) {

      var profile = user.getBasicProfile();
    
      this.set({
        'id': profile.getId(),
        'name': profile.getName(),
        'image_url': profile.getImageUrl(),
        'email': profile.getEmail(),
        'signed_in': true
      });

      var auth = user.getAuthResponse();

      this.set({ 'token': auth.access_token });

    }

  },

  signIn: function () {

    var model = this;

    var promise = $.Deferred();

    //console.log('Signing into Google...');

    gAuth.

    done(function (service) {

      service.
      
      signIn().
      
      then(function (user) {

        //console.log('...signed in.');

        promise.resolve();

        model.setUserAttributes(user);

      });

    });

    return promise;

  },

  signOut: function () {

    var model = this;

    var promise = $.Deferred();

    //console.log('Signing out of Google...');

    gAuth.

    done(function (service) {

      service.
    
      signOut().

      then(function () {

        //console.log('...signed out.');

        promise.resolve();

        model.clear();

      });

    });

    return promise;

  },

  grantOfflineAccess: function () {

    var model = this;

    //console.log('Fully signing in...');

    return gAuth.

    done(function (service) {

      service.
    
      grantOfflineAccess({  // Grant the one-time code
        'redirect_uri': config.redirect_uri
      }).
      
      then(function (response) {

        console.log('... functionality not yet available.');

        // model.set('token', response.code);

        // TODO: Post to server

      });

    });

    return this;

  },

  fetch: function (options) {

    // TODO: Explore errors and return values

    var model = this;

    this.promise = this.promise
      && this.promise.state() === 'pending'
      ? this.promise
      : $.Deferred();

    this.trigger('request', this.promise, options);

    gAuth.
    
    done(function (service) {
    
      var user = service.currentUser.get();
    
      model.setUserAttributes(user);
    
      model.promise.resolve(user);
    
      model.trigger('sync', model, user);
    
    });

    return this.promise;

  }

});

},{"../../../architecture/classes/Model.js":2,"../config/google.json":10,"../services/gAuth.js":21,"jquery":"jquery","underscore":"underscore"}],18:[function(require,module,exports){
'use strict';

var _ = require('underscore');

var Model = require('../../../architecture/classes/Model.js');

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
  },

  format: function (key) {
    var timestamp = new Date(this.get(key));
    var today = new Date();
    var time = key + ' @ ' + timestamp.toLocaleTimeString();
    var date = key + ' on ' + timestamp.toDateString();
    return (timestamp.getDay() === today.getDay()) ? time : date;
  }

});

},{"../../../architecture/classes/Model.js":2,"underscore":"underscore"}],19:[function(require,module,exports){
'use strict';

var backbone = require('backbone');

var Collection = require('../../../architecture/classes/Collection.js');

var Task = require('../models/Task');

module.exports = Collection.extend({

  model: Task,
  
  localStorage: new backbone.LocalStorage('TasksApp')

});

},{"../../../architecture/classes/Collection.js":1,"../models/Task":18,"backbone":"backbone"}],20:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var Router = require('../../../architecture/classes/Router.js');

module.exports = Router.extend({

  routes: {
    '':            require('../handlers/tasks_handler.js'),
    'tasks/:id':   require('../handlers/task_handler.js'),
    'account/:id': require('../handlers/account_handler.js'),
    'login':       require('../handlers/login_handler.js')
  },

  authenticate: function () {

    var router = this;

    var deferred = $.Deferred();

    var account = require('../singletons/account_singleton.js');

    account.fetch().

    done(function () {

      if (account.isSignedIn())

        deferred.resolveWith(router, [account]);

      else

        deferred.rejectWith(router, [account]);

    });

    return deferred;
  
  }

});

},{"../../../architecture/classes/Router.js":3,"../handlers/account_handler.js":12,"../handlers/login_handler.js":13,"../handlers/task_handler.js":14,"../handlers/tasks_handler.js":15,"../singletons/account_singleton.js":22,"jquery":"jquery","underscore":"underscore"}],21:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var config = require('../config/google.json');

var deferred = $.Deferred();

if (deferred.state() != 'resolved') {
  
  gapi.

  load('auth2', function () {

    gapi.auth2.

    init({ 
      'client_id': config.client_id,
      'scope': config.scope
    }).

    then(deferred.resolve);

  });

}

module.exports = deferred;

},{"../config/google.json":10,"jquery":"jquery","underscore":"underscore"}],22:[function(require,module,exports){
'use strict';

var GoogleAccountModel = require('../models/Google_Account_Model.js');

module.exports =  new GoogleAccountModel();

},{"../models/Google_Account_Model.js":17}],23:[function(require,module,exports){
'use strict';

var Tasks = require('../models/Tasks.js');

module.exports = new Tasks();

},{"../models/Tasks.js":19}],24:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

var keycodes = require('../config/keycodes.json');

module.exports = View.extend({

  template: require('../../templates/account_card.html'),

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  events: {
    'click #account-grant':   'onGrantClick',
    'click #account-signout': 'onSignoutClick',
  },

  onGrantClick: function () {
    this.model.grantOfflineAccess();
  },

  onSignoutClick: function () {
    var transition = _.partial(window.transition.to, 'login');
    this.model.signOut().done(transition);
  }
  
});

},{"../../../architecture/classes/View.js":4,"../../templates/account_card.html":35,"../config/keycodes.json":11,"jquery":"jquery","underscore":"underscore"}],25:[function(require,module,exports){
'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/account_page.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  defaultViews: {
    'main': 'accountCard'
  },

  accountCard: function () {
    var AccountCard = require('./Account_Card.js');
    return new AccountCard({ model: this.model });
  }

});

},{"../../../architecture/classes/View.js":4,"../../templates/account_page.html":36,"./Account_Card.js":24,"underscore":"underscore"}],26:[function(require,module,exports){
'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/login_card.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  events: {
    'click #signin': 'onSigninClick'
  },

  onSigninClick: function () {
    var transition = _.partial(window.transition.to, '');
    this.model.signIn().done(transition);
  }

});
},{"../../../architecture/classes/View.js":4,"../../templates/login_card.html":37,"underscore":"underscore"}],27:[function(require,module,exports){
'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/login_page.html'),

  defaultViews: {
    'main': 'loginCard'
  },

  loginCard: function () {
    var LoginCard = require('./Login_Card.js');
    return new LoginCard({ model: this.model });
  }

});
},{"../../../architecture/classes/View.js":4,"../../templates/login_page.html":38,"./Login_Card.js":26,"underscore":"underscore"}],28:[function(require,module,exports){
'use strict';

var View = require('../../../architecture/classes/View.js');

var codes = require('../config/keycodes.json');

module.exports = View.extend({

  template: require('../../templates/task_card.html'),

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  postrender: function (options) {
    componentHandler.upgradeElements(this.el);
  },

  events: {
    'keyup #inputTitle': 'updateTitle',
    'keyup #inputDetails': 'updateDetails',
    'mouseup #delete': 'delete',
    'mouseup #toggleCompletion': 'toggleCompletion'
  },

  isEnter: function (event) {
    return (event.which === codes['ENTER']) ? true : false;
  },

  updateTitle: function (event) {
    this.isEnter(event) &&
    this.model.save({
      'title': this.$('#inputTitle').val().trim()
    });
  },

  updateDetails: function (event) {
    this.isEnter(event) &&
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
  }
  
});

},{"../../../architecture/classes/View.js":4,"../../templates/task_card.html":39,"../config/keycodes.json":11}],29:[function(require,module,exports){
'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/task_item.html'),

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  events: {
    'click .task-toggle': 'onToggleClick',
    'click .task-delete': 'onDeleteClick'
  },

  onToggleClick: function () {
    this.model.toggleCompletion();
  },

  onDeleteClick: function () {
    this.model.destroy();
    this.remove();
  }
  
});

},{"../../../architecture/classes/View.js":4,"../../templates/task_item.html":40,"underscore":"underscore"}],30:[function(require,module,exports){
'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/task_page.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  defaultViews: {
    'header': 'toolBar',
    'main':   'taskCard'
  },

  toolBar: function () {
    var account = require('../singletons/account_singleton.js');
    var ToolBar = require('./Tool_Bar.js');
    return new ToolBar({ model: account });
  },

  taskCard: function () {
    var TaskCard = require('./Task_Card.js');
    return new TaskCard({ model: this.model });
  }

});

},{"../../../architecture/classes/View.js":4,"../../templates/task_page.html":41,"../singletons/account_singleton.js":22,"./Task_Card.js":28,"./Tool_Bar.js":34,"underscore":"underscore"}],31:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

var keycodes = require('../config/keycodes.json');

module.exports = View.extend({

  template: require('../../templates/tasks_input.html'),

  initialize: function () {

  },

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  events: {
    'keydown #tasks-input':  'onInputKeyup',
    'click   #tasks-toggle': 'onToggleClick'
  },

  onInputKeyup: function (event) {
    switch (event.which) {
      case keycodes['ENTER'] : this.onInputEnter($(event.currentTarget)); break;
    }
  },

  onInputEnter: function ($input) {
    
    var task = this.collection.create({
      'created': Date.now(),
      'title': $input.val().trim()
    }, {
      validate: true,
      wait: true
    });

    if (!! task) {
      $input.val('').blur();
      this.$('.mdl-js-textfield')[0].MaterialTextfield.checkDirty();
    }

  },

  onToggleClick: function () {

    // Coax into boolean flag
    var flag = !!this.collection.find(function (model) {
      return !model.get('completed');
    });

    // Set all true if any flag otherwise set all false
    this.collection.each(function (model) {
      model.complete(flag);
    });
  }

});

},{"../../../architecture/classes/View.js":4,"../../templates/tasks_input.html":42,"../config/keycodes.json":11,"jquery":"jquery","underscore":"underscore"}],32:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

var TaskItem = require('./Task_Item.js');

module.exports = View.extend({

  template: require('../../templates/tasks_list.html'),

  initialize: function () {
    this.listenTo(this.collection, 'update', this.render);
  },

  // Construct the list with the compositor w/ GC in mind
  postrender: function () {
    
    componentHandler.upgradeElements(this.el);

    var children = this.collection.map(function (task) {
      return new TaskItem({ model: task });
    });

    // The appendViews is optimized to use a document fragment
    this.appendViews(children, 'ul');

  }

});

},{"../../../architecture/classes/View.js":4,"../../templates/tasks_list.html":43,"./Task_Item.js":29,"jquery":"jquery","underscore":"underscore"}],33:[function(require,module,exports){
'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/tasks_page.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  defaultViews: {
    'header':       'toolBar',
    '#tasks-input': 'tasksInput',
    '#tasks-list':  'tasksList',
  },

  toolBar: function () {
    var account = require('../singletons/account_singleton.js');
    var ToolBar = require('./Tool_Bar.js');
    return new ToolBar({ model: account });
  },

  tasksInput: function () {
    var TasksInput = require('./Tasks_Input.js');
    return new TasksInput({ collection: this.collection });
  },

  tasksList: function () {
    var TasksList = require('./Tasks_List.js');
    return new TasksList({ collection: this.collection });
  }

});

},{"../../../architecture/classes/View.js":4,"../../templates/tasks_page.html":44,"../singletons/account_singleton.js":22,"./Tasks_Input.js":31,"./Tasks_List.js":32,"./Tool_Bar.js":34,"underscore":"underscore"}],34:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/tool_bar.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  }

});

},{"../../../architecture/classes/View.js":4,"../../templates/tool_bar.html":45,"jquery":"jquery","underscore":"underscore"}],35:[function(require,module,exports){
module.exports = "<div class=\"mdl-grid\">\n  <div class=\"mdl-cell mdl-cell--4-col mdl-cell--4-offset-desktop mdl-cell--1-offset-tablet mdl-cell--middle custom-cell--center\">\n    <div class=\"mdl-card mdl-shadow--2dp\">\n      <div class=\"mdl-card__menu\">\n        <button class=\"mdl-button mdl-js-button mdl-button--icon\">\n          <% if ( isPending() ) {%>\n            <div class=\"mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active\"></div>\n          <% } else if ( isResolved() && has('id') ) { %>\n            <img src=<%= get('image_url') %> width=\"32px\" height=\"32px\" />\n          <% } %>\n        </button>\n      </div>\n      <% if ( isPending() ) { %>\n        <div class=\"mdl-card__title\">\n          <h2 class=\"mdl-card__title-text\">Initializing <%- get('provider') %>...</h2>\n        </div>\n      <% } else if ( ( isResolved() && has('id') ) ) { %>\n        <div class=\"mdl-card__supporting-text\">\n          <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n            <input class=\"mdl-textfield__input\" type=\"text\" disabled>\n            <label class=\"mdl-textfield__label\"><%- get('name') %></label>\n          </div>\n          <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n            <input class=\"mdl-textfield__input\" type=\"text\" disabled>\n            <label class=\"mdl-textfield__label\"><%- get('email') %></label>\n          </div>\n          <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n            <input class=\"mdl-textfield__input\" type=\"text\" disabled>\n            <label class=\"mdl-textfield__label\"><%- get('provider') %> Account</label>\n          </div>\n        </div>\n      <% } %>\n      <div class=\"mdl-card__actions mdl-card--border\">\n        <a href=\"/<\" class=\"mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect\">\n          <i class=\"material-icons\">arrow_back</i>\n        </a>\n        <a href=\"/\" class=\"mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect\">\n          <i class=\"material-icons\">home</i>\n        </a>\n        <% if ( isResolved() && has('id') ) { %>\n          <button class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" id=\"account-grant\">\n            grant offline access\n          </button>\n          <button class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" id=\"account-signout\">sign out</button>\n        <% } %>\n      </div>\n    </div>\n  </div>\n</div>";

},{}],36:[function(require,module,exports){
module.exports = "<div>\n  <div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-header\">\n    <header class=\"mdl-layout__header mdl-layout__header--scroll mdl-layout__header--transparent\"><!-- Tool bar injected here --></header>\n    <main class=\"mdl-layout__content\"><!-- Tasks sheet injected here  --></main>\n  </div>\n</div>";

},{}],37:[function(require,module,exports){
module.exports = "<div class=\"mdl-grid\">\n  <div class=\"mdl-cell mdl-cell--4-col mdl-cell--4-offset-desktop mdl-cell--1-offset-tablet mdl-cell--middle custom-cell--center\">\n\n    <% if ( isPending() ) {%>\n      <div class=\"mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active\"></div>\n    <% } else { %>\n      <button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" style=\"width: 100%; font-size: 16px; margin: 20px 0 10px; font-weight: 300; height: 58px; border: 1px solid rgba(76,87,102,0.1); color: #000000;\" id=\"signin\">\n        <span style=\"vertical-align: middle; float: left;\">\n          <img src=\"/images/g-logo.png\" height=\"22\" width=\"22\">\n        </span>\n        <span style=\"text-transform: capitalize; vertical-align: middle;\">Continue With Google</span>\n      </button>\n    <% } %>\n\n  </div>\n</div>";

},{}],38:[function(require,module,exports){
module.exports = "<div>\n  <main><!-- Content injected here --></main>\n</div>";

},{}],39:[function(require,module,exports){
module.exports = "<div class=\"mdl-grid\">\n  <div class=\"mdl-cell mdl-cell--4-col mdl-cell--4-offset-desktop mdl-cell--1-offset-tablet mdl-cell--middle custom-cell--center\">\n    <div class=\"mdl-card mdl-shadow--2dp\">\n      <div class=\"mdl-card__menu\">\n        <button class=\"mdl-button mdl-js-button mdl-button--icon\">\n          <% if ( isPending() ) {%>\n          <div class=\"mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active\"></div>\n          <% } else if ( isResolved() && has('id') ) { %>\n          <i class=\"material-icons\"><% has('completed') ? print('check_box') : print('check_box_outline_blank') %></i>\n          <% } %>\n        </button>\n      </div>\n      <div class=\"mdl-card__title\"></div>\n      <div class=\"mdl-card__supporting-text\">\n        <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n          <input class=\"mdl-textfield__input\" type=\"text\" id=\"inputTitle\" length=\"23\" <% has('completed') && print('disabled')%> >\n          <label class=\"mdl-textfield__label\" for=\"inputTitle\"><%- get('title') %></label>\n        </div>\n        <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n          <textarea class=\"mdl-textfield__input\" type=\"text\" rows= \"1\" id=\"inputDetails\" <% has('completed') && print('disabled') %>></textarea>\n          <label class=\"mdl-textfield__label\" for=\"inputDetails\"><% has('details') ? print(get('details')) : print(\"Add details\") %></label>\n        </div>\n      </div>\n      <div class=\"mdl-card__actions mdl-card--border\">\n        <button href=\"/<\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n          <i class=\"material-icons\">arrow_back</i>\n        </button>\n        <button href=\"/\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n          <i class=\"material-icons\">home</i>\n        </button>\n        <a id=\"delete\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\">\n          Delete\n        </a>\n        <a id=\"toggleCompletion\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\">\n          Toggle Completion\n        </a>\n      </div>\n    </div>\n  </div>\n</div>\n";

},{}],40:[function(require,module,exports){
module.exports = "<li>\n  <div class=\"mdl-card mdl-shadow--2dp\">\n    <div class=\"mdl-card__supporting-text\">\n    <div class=\"avatar-wrapper left right\">\n      <div class=\"avatar left\">\n        <label class=\"mdl-checkbox mdl-js-checkbox\" for=\"checkbox-<%- get('id') %>\">\n          <input type=\"checkbox\" id=\"checkbox-<%- get('id') %>\" class=\"mdl-checkbox__input task-toggle\" <% has('completed') && print('checked') %>>\n        </label>\n      </div>\n      <p href=\"/tasks/<%- get('id') %>\" class=\"task <% has('completed') && print('completed') %>\"><%- get('title') %></p>\n      <span>\n        <% has('details') && print(get('details'), '<br>') %>\n        <% print(format('created'), '<br>') %>\n        <% has('due') && print(format('due'), '<br>') %>\n        <% has('completed') && print(format('completed')) %>\n      </span>\n      <div class=\"avatar right\">\n        <button class=\"mdl-button mdl-js-button mdl-button--icon task-delete\">\n          <i class=\"material-icons\">delete</i>\n        </button>\n      </div>\n    </div>\n    </div>\n  </div>\n</li>\n";

},{}],41:[function(require,module,exports){
module.exports = "<div>\n  <div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-header\">\n    <header class=\"mdl-layout__header mdl-layout__header--scroll mdl-layout__header--transparent\"><!-- Tool bar injected here --></header>\n    <main class=\"mdl-layout__content\"><!-- Task card injected here  --></main>\n  </div>\n</div>";

},{}],42:[function(require,module,exports){
module.exports = "<div class=\"avatar-wrapper right\">\n  <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n    <input class=\"mdl-textfield__input\" type=\"text\" length=\"23\" id=\"tasks-input\">\n    <label class=\"mdl-textfield__label\" for=\"inputTitle\">What needs to be done?</label>\n  </div>\n  <div class=\"avatar-fab right\">\n    <button class=\"mdl-button mdl-js-button mdl-button--fab mdl-button--colored\" id=\"tasks-toggle\">\n      <i class=\"material-icons\">done_all</i>\n    </button>\n  </div>\n</div>\n";

},{}],43:[function(require,module,exports){
module.exports = "<div>\n  <ul><!-- List view appends fragment post render --></ul>\n</div>";

},{}],44:[function(require,module,exports){
module.exports = "<div>\n  <div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-header\">\n    <header class=\"mdl-layout__header mdl-layout__header--scroll mdl-layout__header--transparent\"><!-- Tool bar injected here --></header>\n    <main class=\"mdl-layout__content\">\n      <div class=\"mdl-grid\">\n        <div class=\"mdl-cell mdl-cell--4-col mdl-cell--4-offset-desktop mdl-cell--1-offset-tablet mdl-cell--middle custom-cell--center\">\n        <div id=\"tasks-input\"><!-- Input injected here --></div>\n        <div id=\"tasks-list\"><!-- List injected here --></div>\n        </div>\n    </main>\n  </div>\n</div>";

},{}],45:[function(require,module,exports){
module.exports = "<div class=\"mdl-layout__header-row\">\n  <div class=\"mdl-layout-spacer\"></div>\n  <nav class=\"mdl-navigation mdl-layout--large-screen-only\">\n    <span style=\"color: black; font-weight: 300; font-family: 'Roboto'; line-height: 64px; padding: 0 12px;\">\n      Hello, <%- get('name').split(' ', 1)[0] %>\n    </span>\n    <a class=\"mdl-button mdl-js-button mdl-button--icon\" href=\"/account/<%= get('id') %>\">\n      <img src=\"<%= get('image_url') %>\" width=\"32px\" height=\"32px\" />\n    </a>\n  </nav>\n</div>";

},{}]},{},[16]);
