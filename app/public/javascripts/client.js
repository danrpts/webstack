(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var _ = require('underscore');
var backbone = require('backbone');
var helpers = require('../helpers/model_helpers.js');
var create = _.isFunction(Object.create) ? Object.create : _.create;

var specials =  {

  // THOUGHT:
  // This logic exists implicitly in controller/view flow
  // REF:
  // https://youtu.be/P0YIdsJqKV4
  lookup: function (itemid) {
    var model;

    // Find model in local collection
    if (model = this.get(itemid)) {

      // Return as a resolved promise
      model = $.Deferred().resolveWith(this, [model]);

    }

    // Try to find cached model in local storage
    else {

      // First create an instance
      model = this.add({ id: itemid });

    }

    // Then return as a promise
    return model.promise();

  }

}

var Collection = module.exports = function (models, options) {
  backbone.Collection.apply(this, arguments);
}

Collection.prototype = create(backbone.Collection.prototype);

_.extend(Collection.prototype, specials, helpers);

Collection.extend = backbone.Collection.extend;

},{"../helpers/model_helpers.js":10,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],2:[function(require,module,exports){
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

},{"../helpers/model_helpers.js":10,"backbone":"backbone","underscore":"underscore"}],3:[function(require,module,exports){
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

},{"../helpers/router_helpers.js":12,"backbone":"backbone","underscore":"underscore"}],4:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var backbone = require('backbone');
var helpers = require('../helpers/view_helpers.js');
var create = _.isFunction(Object.create) ? Object.create : _.create;

var View = module.exports = function (options) {
  backbone.View.apply(this, arguments);
}

View.prototype = create(backbone.View.prototype);

_.extend(View.prototype, helpers);

View.extend = backbone.View.extend;

},{"../helpers/view_helpers.js":13,"backbone":"backbone","underscore":"underscore"}],5:[function(require,module,exports){
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

var $ = require('jquery');
var _ = require('underscore');
var PageView = require('../views/Page_View.js');
var LinkView = require('../views/AccountLink_View.js');
var CardView = require('../views/AccountCard_View.js');
var page = require('../singletons/page_singleton.js');
var account = require('../singletons/account_singleton.js');

module.exports = function () {

  (!!page)
    && page.remove();

  (page = new PageView())

  .insert($('[data-region="layout"]'))

  .then(function () {

    (new LinkView({ model: account }))

    .insert(page.$('[data-region="header"]'));

    (new CardView({ model: account }))

    .insert(page.$('[data-region="content"]'), {

      wait: account.promise(),
      
      delay: 0

    });

  });

}

},{"../singletons/account_singleton.js":20,"../singletons/page_singleton.js":21,"../views/AccountCard_View.js":23,"../views/AccountLink_View.js":24,"../views/Page_View.js":25,"jquery":"jquery","underscore":"underscore"}],8:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var _ = require('underscore');
var PageView = require('../views/Page_View.js');
var LinkView = require('../views/AccountLink_View.js');
var CardView = require('../views/TasksCard_View.js');
var page = require('../singletons/page_singleton.js');
var account = require('../singletons/account_singleton.js');
var tasks = require('../singletons/tasks_singleton.js');

module.exports = function (itemid) {

  (!!page)
    && page.remove();

  (page = new PageView())

  .insert($('[data-region="layout"]'))

  .then(function () {

    (new LinkView({ model: account }))

    .insert(page.$('[data-region="header"]'));

    var item = tasks.add({ id: itemid });

    (new CardView({ model: item }))

    .insert(page.$('[data-region="content"]'), {

      wait: item.promise(),
      
      delay: 0

    });

  });

}

},{"../singletons/account_singleton.js":20,"../singletons/page_singleton.js":21,"../singletons/tasks_singleton.js":22,"../views/AccountLink_View.js":24,"../views/Page_View.js":25,"../views/TasksCard_View.js":26,"jquery":"jquery","underscore":"underscore"}],9:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var _ = require('underscore');
var PageView = require('../views/Page_View.js');
var LinkView = require('../views/AccountLink_View.js');
var ListView = require('../views/TasksList_View.js');
var page = require('../singletons/page_singleton.js');
var account = require('../singletons/account_singleton.js');
var tasks = require('../singletons/tasks_singleton.js');

module.exports = function () {

  (!!page)
    && page.remove();

  (page = new PageView())

  .insert($('[data-region="layout"]'))

  .then(function () {

    (new LinkView({ model: account }))

    .insert(page.$('[data-region="header"]'));

    (new ListView({ collection: tasks }))

    .insert(page.$('[data-region="content"]'), {

      wait: tasks.promise(),
      
      delay: 0

    });

  });

}

},{"../singletons/account_singleton.js":20,"../singletons/page_singleton.js":21,"../singletons/tasks_singleton.js":22,"../views/AccountLink_View.js":24,"../views/Page_View.js":25,"../views/TasksList_View.js":28,"jquery":"jquery","underscore":"underscore"}],10:[function(require,module,exports){
'use strict';

module.exports = {
  
  promise: function (options) {
    options = options || {};
    return this.fetch(options).promise();
  }

}

},{}],11:[function(require,module,exports){

// Import this within a context to return a closure
module.exports = function () {
  
  // Using eval so that context may be deleted
  // http://perfectionkills.com/understanding-delete/
  eval('var context = this;');

  return {

    id: function () {
      return context.id;
    },

    get: function (key) {
      return context.get(key);
    },

    has: function (key) {
      return (!!context.get(key));
    },

    size: function () {
      return context.length;
    },

    format: function (key) {
      var timestamp = new Date(context.get(key));
      var today = new Date();
      var time = key + ' @ ' + timestamp.toLocaleTimeString();
      var date = key + ' on ' + timestamp.toDateString();
      return (timestamp.getDay() === today.getDay()) ? time : date;
    },

    release: function () {
      console.log('Releasing closure on context.');
      delete context;
    }

  }
}

},{}],12:[function(require,module,exports){
'use strict';

var backbone = require('backbone');

module.exports = {
  
  to: function (fragment) {
    backbone.Router.prototype.navigate.call(this, fragment, true);
  },

  back: function () {
    window.history.back();
  },

  forward: function () {
    window.history.forward();
  }

}
},{"backbone":"backbone"}],13:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var _ = require('underscore');
var backbone = require('backbone');
var closure = require('./presenter_helpers.js');

module.exports = {

  // Release the context
  remove: function () {
    (!!this.presenter)
      && this.presenter.release();
    backbone.View.prototype.remove.apply(this, arguments);
  },

  compile: function () {

    // Hoist 'em
    var entity, template, templater, compiled;

    // Reference the model or collection or none
    entity
      = this.model
      || this.collection
      || false;

    // When it's the intitial render, build the presenter
    (!this.rendered)
      && (!!entity)
      && (this.presenter = closure.call(entity));

    // Allow overriding of underscore's templater
    templater
      = _.isFunction(this.templater)
      ? this.templater
      : _.template;

    // First run the markup through the templater
    template = templater(this.template);

    // Then run the presenter through the templater
    compiled
      = (!!this.presenter)
      ? template(this.presenter)
      : template();

    // Jquery this sucker
    this.$compiled = $(compiled);

    // Chaining
    return this;

  },

  render: function (callback) {

    // Compile the $el
    this.compile();

    // Initial vs. Re-render
    (!this.rendered)
      ? this.setElement(this.$compiled)
      : this.$el.html(this.$compiled.html());

    // Set state
    this.rendered = true;

    // Material Design Lite (MDL)
    componentHandler.upgradeElements(this.el);

    // Allow injection of async code
    _.isFunction(callback)
      && callback.call(this);

    // Force chaining on this
    return this;

  },

  wait: function ($region, promises, options) {

    console.log("Loading resource...");

    var context = this;

    var intermediary = $.Deferred();

    // Move this to a template or view
    var $loader = $('\
      <div class="app">\
        <div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active loader"></div>\
      </div>\
    ');

    options = options || {};

    _.defaults(options, {
      delay: 0
    })

    promises
      = _.isArray(promises)
      ? promises
      : [promises];

    // Material Design Lite (MDL)
    componentHandler.upgradeElements($loader[0]);

    // Animate the loader
    $region.html($loader.hide().fadeIn());

    $.when(promises).done(function (promises) {

      // Artificial delay for perceived performance
      setTimeout(function () {

        console.log("...resource resolved.");

        $loader.fadeOut(function () {

          intermediary.resolveWith(context, promises);

        });

      }, Math.round(options.delay));

    });

    return intermediary;

  },

  // High-level insert renderer
  insert: function ($region, options) {

    var intermediary;

    options = options || {};

    _.defaults(options, {
      wait: false,
      delay: 0
    });

    intermediary
      = (!!options.wait)
      ? this.wait($region, options.wait, { delay: options.delay })
      : $.Deferred().resolveWith(this);

    intermediary.done(function () {

      $region.html(this.render().$el);

    });

    return intermediary;

  }

}

},{"./presenter_helpers.js":11,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],14:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var backbone = require('backbone');
backbone.LocalStorage = require('backbone.localstorage');
var TransitionRouter = require('./routers/Transition_Router.js');

$(function() {

  window.transition = new TransitionRouter();

  // TODO:
  // Using { pushState: true } requires thought-out server
  backbone.history.start(); 

});

},{"./routers/Transition_Router.js":19,"backbone":"backbone","backbone.localstorage":"backbone.localstorage","jquery":"jquery"}],15:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var backbone = require('backbone');
var Model = require('../classes/Model.js');

module.exports = Model.extend({

  defaults: {
    'name': undefined,
    'image_url': undefined,
    'email': undefined,
    'provider': undefined,
    'fully_signed_in': false
  },

  // Temporary until controllers are depricated and view handles loading by listening to promises
  promise: function () {
    return $.Deferred().resolveWith(this, [this.toJSON()]).promise();
  }

});

},{"../classes/Model.js":2,"backbone":"backbone","jquery":"jquery"}],16:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var _ = require('underscore');
var AccountModel = require('./Account_Model.js');
var config = require('../config/google_config.json');

module.exports = AccountModel.extend({

  setGoogleUser: function (user) {

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

  initialize: function () {

    // Bind the signin/signout handler
    var setOrClear = _.bind(this.setGoogleUser, this);

    // Load the auth2 api
    gapi.load('auth2', function () {

      // Initiate new 'auth client'
      gapi.auth2
      .init({ 
        'client_id': config.client_id 
      });

      // Listen and set the user attributes
      gapi.auth2
      .getAuthInstance()
      .currentUser.listen(setOrClear);

    });

  },

  signIn: function (callback) {

    var context = this;

    console.log('Signing into Google...');

    gapi.auth2
    .getAuthInstance()
    .signIn()
    .then(function (user) {

      console.log('...signed in.');

      _.isFunction(callback)
        && callback.call(context, user);

    });

  },

  signOut: function (callback) {

    var context = this;

    console.log('Signing out of Google...');

    gapi.auth2
    .getAuthInstance()
    .signOut()
    .then(function () {

      console.log('...signed out.');

      _.isFunction(callback)
        && callback.call(context);

    });

  },

  grantOfflineAccess: function (callback) {

    var context = this;

    console.log('Fully signing in...');

    gapi.auth2
    .getAuthInstance()
    .grantOfflineAccess({  // Grant the one-time code
      'redirect_uri': config.redirect_uri
    })
    .then(function (response) {

      console.log('...functionality not available.');

      context.set('token', response.code);

      // TODO: Post to server

      _.isFunction(callback)
        && callback.call(context);

    });

  }

});

},{"../config/google_config.json":5,"./Account_Model.js":15,"jquery":"jquery","underscore":"underscore"}],17:[function(require,module,exports){
'use strict';

var backbone = require('backbone');
var Collection = require('../classes/Collection.js');

module.exports = Collection.extend({

  model: require('./Tasks_Model.js'),
  
  localStorage: new backbone.LocalStorage('TasksApp')

});

},{"../classes/Collection.js":1,"./Tasks_Model.js":18,"backbone":"backbone"}],18:[function(require,module,exports){
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
      'completed': bool ? Date.now() : null
    }, {
      wait: true
    });
  },

  toggleCompletion: function () {
    (!! this.get('completed'))
      ? this.complete(false)
      : this.complete(true);
  },

  validate: function (attributes) {
    if (_.has(attributes, 'title') && attributes.title.length === 0) {
      return "Title cannot be empty.";
    }
  }

});

},{"../classes/Model.js":2,"backbone":"backbone","underscore":"underscore"}],19:[function(require,module,exports){
'use strict';

var Router = require('../classes/Router.js');
var tasksListController = require('../controllers/tasks_list_controller.js');
var accountCardController = require('../controllers/account_card_controller.js');
var tasksCardController = require('../controllers/tasks_card_controller.js');

module.exports = Router.extend({

  routes: {
    '': tasksListController,
    'account/:id': accountCardController,
    'tasks/:id': tasksCardController
  }

});

},{"../classes/Router.js":3,"../controllers/account_card_controller.js":7,"../controllers/tasks_card_controller.js":8,"../controllers/tasks_list_controller.js":9}],20:[function(require,module,exports){
'use strict';

var GoogleAccountModel = require('../models/Google_Account_Model.js');

module.exports =  new GoogleAccountModel();

},{"../models/Google_Account_Model.js":16}],21:[function(require,module,exports){
'use strict';

module.exports = undefined;

},{}],22:[function(require,module,exports){
'use strict';

var TasksCollection = require('../models/Tasks_Collection.js');

module.exports = new TasksCollection();

},{"../models/Tasks_Collection.js":17}],23:[function(require,module,exports){
'use strict';

var View = require('../classes/View.js');
var account = require('../singletons/account_singleton.js');

module.exports = View.extend({

  template: require('../../templates/account_card_template.html'),

  events: {
    'mouseup #transitionBack': 'transitionBack',
    'mouseup #transitionHome': 'transitionHome',
    'mouseup #grantOfflineAccess': 'grantOfflineAccess',
    'mouseup #signOut': 'signOut'
  },
  
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  transitionBack: function () {
     window.transition.back();
  },

  transitionHome: function () {
     window.transition.to('');
  },

  grantOfflineAccess: function () {
    account.grantOfflineAccess();
  },

  signOut: function () {
    account.signOut(this.transitionHome);
  },

  render: function () {
    return View.prototype.render.call(this, function () {
      this.$el.hide().fadeIn();
    });
  }
  
});

},{"../../templates/account_card_template.html":29,"../classes/View.js":4,"../singletons/account_singleton.js":20}],24:[function(require,module,exports){
'use strict';

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
    window.transition.to('account/' + this.model.id);
  },

  signIn: function () {
    account.signIn();
  }

});

},{"../../templates/account_link_template.html":30,"../classes/View.js":4,"../singletons/account_singleton.js":20}],25:[function(require,module,exports){
'use strict';

var View = require('../classes/View.js');

module.exports = View.extend({

  template: require('../../templates/fixed_header_transparent_template.html')

});

},{"../../templates/fixed_header_transparent_template.html":31,"../classes/View.js":4}],26:[function(require,module,exports){
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
    },
    { wait: true });
  },

  updateDetails: function () {
    this.model.save({
      'details': this.$('#inputDetails').val().trim()
    },
    { wait: true });
  },

  toggleCompletion: function () {
    this.model.toggleCompletion();
  },

  transitionBack: function () {
     window.transition.back();
  },

  transitionHome: function () {
     window.transition.to('');
  },

  delete: function () {
    this.model.destroy();
    this.remove();
    this.transitionBack();
  },
  
});

},{"../../templates/tasks_card_template.html":32,"../classes/View.js":4,"underscore":"underscore"}],27:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var View = require('../classes/View.js');

module.exports = View.extend({

  template: require('../../templates/tasks_item_template.html'),

  events: {
    'mouseup #toggleCompletion' : 'toggleCompletion',
    'mouseup #transitionToTask' : 'transitionToTask',
    'mouseup #delete' : 'delete'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  toggleCompletion: function () {
    this.model.toggleCompletion();
  },

  transitionToTask: function () {
     window.transition.to('tasks/' + this.model.id);
  },

  delete: function () {
    var remove = _.bind(this.remove, this);
    this.model.destroy();
    this.$el.fadeOut(remove);
  },

  render: function () {
    return View.prototype.render.call(this, function () {
      this.$el.fadeIn();
    });
  }
  
});

},{"../../templates/tasks_item_template.html":33,"../classes/View.js":4,"underscore":"underscore"}],28:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var View = require('../classes/View.js');
var ItemView = require('./TasksItem_View.js');
var codes = require('../config/keycodes_config.json');

module.exports = View.extend({

  template: require('../../templates/tasks_list_template.html'),

  events: {
    'mouseup #toggleAllCompletion' : 'toggleAllCompletion',
    'keyup #inputTitle' : 'onEnter'
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

  appendItem: function (item) {
    var $input = this.$('#inputTitle');
    item = item || this.collection.create({
      'created': Date.now(),
      'title': $input.val().trim()
    },
    { wait: true });
    $input.val('').blur();

    // Ugly MDL workaround
    this.$('.mdl-js-textfield')[0].MaterialTextfield.checkDirty();
    (new ItemView({ model: item }))
    .render().$el.appendTo(this.$('ul#task-items'));
  },

  render: function () {
    return View.prototype.render.call(this, function () {
      var $fragment = $(document.createDocumentFragment());
      this.collection.each(function (item) {
        (new ItemView({ model: item }))
        .render().$el.appendTo($fragment);
      });
      $fragment.appendTo(this.$('ul#task-items'));
    });
  }

});

},{"../../templates/tasks_list_template.html":34,"../classes/View.js":4,"../config/keycodes_config.json":6,"./TasksItem_View.js":27,"jquery":"jquery"}],29:[function(require,module,exports){
module.exports = "<div class=\"app\">\n  <div class=\"mdl-card mdl-shadow--2dp\">\n    <div class=\"mdl-card__menu\">\n      <i class=\"material-icons\">fingerprint</i>\n    </div>\n    <div class=\"mdl-card__title\"></div>\n    <div class=\"mdl-card__supporting-text\">\n      <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n        <input class=\"mdl-textfield__input\" type=\"text\" disabled>\n        <label class=\"mdl-textfield__label\"><%- get('name') %></label>\n      </div>\n      <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n        <input class=\"mdl-textfield__input\" type=\"text\" disabled>\n        <label class=\"mdl-textfield__label\"><%- get('email') %></label>\n      </div>\n    </div>\n    <div class=\"mdl-card__actions mdl-card--border\">\n      <button id=\"transitionBack\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n        <i class=\"material-icons\">arrow_back</i>\n      </button>\n      <button id=\"transitionHome\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n        <i class=\"material-icons\">home</i>\n      </button>\n      <a id=\"grantOfflineAccess\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\">\n        Grant offline access\n      </a>\n      <a id=\"signOut\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\">\n        Sign out\n      </a>\n    </div>\n  </div>\n</div>\n";

},{}],30:[function(require,module,exports){
module.exports = "<a class=\"mdl-navigation__link\">\n  <button id=\"<% has('id') ? print('transitionToAccount') : print('signIn') %>\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n    <% has('id') ? print('<img src=\"'+get('image_url')+'\" width=\"32px\" height=\"32px\" />') : print('<i class=\"material-icons\">fingerprint</i>') %>\n  </button>\n</a>\n";

},{}],31:[function(require,module,exports){
module.exports = "<div>\n  <div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-header\">\n    <header class=\"mdl-layout__header mdl-layout__header--transparent\">\n      <div class=\"mdl-layout__header-row\">\n        <!-- <span class=\"mdl-layout-title\">Title</span> -->\n        <div class=\"mdl-layout-spacer\"></div>\n        <nav class=\"mdl-navigation mdl-layout--large-screen-only\" data-region=\"header\"></nav>\n        <ul class=\"demo-list-item mdl-list\">\n      </div>\n    </header>\n    <main class=\"mdl-layout__content\">\n      <div class=\"page-content\" data-region=\"content\"></div>\n    </main>\n    <div data-region=\"footer\"></div>\n  </div>\n</div>\n";

},{}],32:[function(require,module,exports){
module.exports = "<div class=\"app\">\n  <div class=\"mdl-card mdl-shadow--2dp\">\n    <div class=\"mdl-card__menu\">\n      <i class=\"material-icons\"><% has('completed') ? print('check_box') : print('check_box_outline_blank') %></i>\n    </div>\n    <div class=\"mdl-card__title\"></div>\n    <div class=\"mdl-card__supporting-text\">\n      <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n        <input class=\"mdl-textfield__input\" type=\"text\" id=\"inputTitle\" length=\"23\" <% has('completed') && print('disabled')%> >\n        <label class=\"mdl-textfield__label\" for=\"inputTitle\"><%- get('title') %></label>\n      </div>\n      <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n        <textarea class=\"mdl-textfield__input\" type=\"text\" rows= \"1\" id=\"inputDetails\" <% has('completed') && print('disabled')%>></textarea>\n        <label class=\"mdl-textfield__label\" for=\"inputDetails\"><% has('details') ? print(get('details')) : print(\"Add details\") %></label>\n      </div>\n    </div>\n    <div class=\"mdl-card__actions mdl-card--border\">\n      <button id=\"transitionBack\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n        <i class=\"material-icons\">arrow_back</i>\n      </button>\n      <button id=\"transitionHome\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n        <i class=\"material-icons\">home</i>\n      </button>\n      <a id=\"delete\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\">\n        Delete\n      </a>\n      <a id=\"toggleCompletion\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\">\n        Toggle Completion\n      </a>\n    </div>\n  </div>\n</div>\n";

},{}],33:[function(require,module,exports){
module.exports = "<li>\n  <div class=\"mdl-card mdl-shadow--2dp\">\n    <div class=\"mdl-card__supporting-text\">\n    <div class=\"avatar-wrapper left right\">\n      <div class=\"avatar left\">\n        <label id=\"toggleCompletion\" class=\"mdl-checkbox mdl-js-checkbox\" for=\"checkbox-<%- get('id') %>\">\n          <input type=\"checkbox\" id=\"checkbox-<%- get('id') %>\" class=\"mdl-checkbox__input\" <% has('completed') && print('checked') %>>\n        </label>\n      </div>\n      <p id=\"transitionToTask\" class=\"<% has('completed') && print('completed') %>\"><%- get('title') %></p>\n      <span>\n        <% has('details') && print(get('details'), '<br>') %>\n        <% print(format('created'), '<br>') %>\n        <% has('due') && print(format('due'), '<br>') %>\n        <% has('completed') && print(format('completed')) %>\n      </span>\n      <div class=\"avatar right\">\n        <button id=\"delete\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n          <i class=\"material-icons\">delete</i>\n        </button>\n      </div>\n    </div>\n    </div>\n  </div>\n</li>";

},{}],34:[function(require,module,exports){
module.exports = "<div class=\"app\">\n  <div class=\"avatar-wrapper right\">\n    <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n      <input class=\"mdl-textfield__input\" type=\"text\" id=\"inputTitle\" length=\"23\">\n      <label class=\"mdl-textfield__label\" for=\"inputTitle\">What needs to be done?</label>\n    </div>\n    <div class=\"avatar-fab right\">\n      <button id=\"toggleAllCompletion\" class=\"mdl-button mdl-js-button mdl-button--fab\">\n        <i class=\"material-icons\">done_all</i>\n      </button>\n    </div>\n  </div>\n  <ul id=\"task-items\"></ul>\n</div>\n";

},{}]},{},[14]);
