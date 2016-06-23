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

},{"../helpers/model_helpers.js":11,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],2:[function(require,module,exports){
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

},{"../helpers/model_helpers.js":11,"backbone":"backbone","underscore":"underscore"}],3:[function(require,module,exports){
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

},{"../helpers/router_helpers.js":13,"backbone":"backbone","underscore":"underscore"}],4:[function(require,module,exports){
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

},{"../helpers/view_helpers.js":14,"backbone":"backbone","underscore":"underscore"}],5:[function(require,module,exports){
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
var PageView = require('../views/default_page_View.js');
var LinkView = require('../views/account_link_View.js');
var CardView = require('../views/account_card_View.js');
var account = require('../singletons/account_singleton.js');
var page = require('../singletons/page_singleton.js');

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

},{"../singletons/account_singleton.js":20,"../singletons/page_singleton.js":21,"../views/account_card_View.js":23,"../views/account_link_View.js":24,"../views/default_page_View.js":25,"jquery":"jquery","underscore":"underscore"}],8:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var _ = require('underscore');
var PageView = require('../views/default_page_View.js');
var LinkView = require('../views/account_link_View.js');
var CardView = require('../views/tasks_card_View.js');
var account = require('../singletons/account_singleton.js');
var tasks = require('../singletons/tasks_singleton.js');
var page = require('../singletons/page_singleton.js');

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

},{"../singletons/account_singleton.js":20,"../singletons/page_singleton.js":21,"../singletons/tasks_singleton.js":22,"../views/account_link_View.js":24,"../views/default_page_View.js":25,"../views/tasks_card_View.js":26,"jquery":"jquery","underscore":"underscore"}],9:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var _ = require('underscore');
var PageView = require('../views/default_page_View.js');
var LinkView = require('../views/account_link_View.js');
var ListView = require('../views/tasks_list_View.js');
var account = require('../singletons/account_singleton.js');
var tasks = require('../singletons/tasks_singleton.js');
var page = require('../singletons/page_singleton.js');

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

},{"../singletons/account_singleton.js":20,"../singletons/page_singleton.js":21,"../singletons/tasks_singleton.js":22,"../views/account_link_View.js":24,"../views/default_page_View.js":25,"../views/tasks_list_View.js":28,"jquery":"jquery","underscore":"underscore"}],10:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var backbone = require('backbone');
var google = require('../config/google_config.json');

module.exports = {

  client: function () {
    return gapi.auth2.getAuthInstance();
  },

  user: function () {
    return this.client().currentUser.get();
  },

  profile: function () {
    return this.user().getBasicProfile();
  },

  connect: function () {

    // First wrap Google's promise with our own
    var that = this;
    var client = $.Deferred();

    // If auth2 api has been loaded
    if ('auth2' in gapi) {

      // Then retreive the existing 'auth client'
      var existing = this.client();

      // Bind the context and resolve
      client.resolveWith(that, [existing]);
    
    }

    // Otherwise, initialize
    else {

      // Load the auth2 api with Google's promise
      gapi.load('auth2', function () {

        // Then initiate a new 'auth client' with Google
        var initiated = gapi.auth2.init({ 'client_id': google.client_id });

        // Integrate Google's event system with backbone
        initiated.isSignedIn.listen(function (status) {
          backbone.trigger('google:isSignedIn', status);
        });

        initiated.currentUser.listen(function (user) {
          backbone.trigger('google:currentUser', user);
        });

        // Bind the context and resolve
        client.resolveWith(that, [initiated]);

      });

    }

    // Return as jQuery promise
    return client.promise();

  },

  signIn: function () {

    // First wrap Google's promise with our own
    var that = this;
    var response = $.Deferred();
    var client = this.client();

    // Invoke sign-in window
    client.signIn().then(function (user) {

      // Bind the context and resolve the code 
      response.resolveWith(that, [user]);

    });

    // Return ad jQuery promise
    return response.promise();

  },

  signOut: function () {

    // First wrap Google's promise with our own
    var that = this;
    var response = $.Deferred();
    var client = this.client();

    // Sign use out
    client.signOut().then(function () {

      // Bind the context and resolve the code 
      response.resolveWith(that);

    });

    // Return ad jQuery promise
    return response.promise();

  },

  grantOfflineAccess: function () {

    // First wrap Google's promise with our own
    var that = this;
    var response = $.Deferred();
    var client = this.client();

    // Grant the one-time code
    client.grantOfflineAccess({ 'redirect_uri': google.redirect_uri }).then(function (authCode) {

      // Bind the context and resolve the code 
      response.resolveWith(that, [authCode]);

    });

    // Return ad jQuery promise
    return response.promise();

  },

  postToServer: function (authCode) {

    console.log(authCode);

    // First wrap Google's promise with our own
    var that = this;
    var response = $.Deferred();
    var client = this.client();

    // Grant the one-time code
    $.ajax({
      type: 'POST',
      url: '/api/account',
      contentType: 'application/json',
      data: JSON.stringify(authCode),
      dataType: 'json',
      processData: false,
      success: function (data, status, xhr) {
        backbone.trigger('google:isFullySignedIn', true);
        response.resolveWith(that, [data]);
      }
    });

    // Return ad jQuery promise
    return response.promise();

  }

}

},{"../config/google_config.json":5,"backbone":"backbone","jquery":"jquery"}],11:[function(require,module,exports){
'use strict';

module.exports = {
  
  promise: function (options) {
    options = options || {};
    return this.fetch(options).promise();
  }

}

},{}],12:[function(require,module,exports){

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

},{}],13:[function(require,module,exports){
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
},{"backbone":"backbone"}],14:[function(require,module,exports){
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

    // Allow injection of async code
    _.isFunction(callback)
      && callback.call(this);

    // Material Design Lite (MDL)
    componentHandler.upgradeElements(this.el);

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

},{"./presenter_helpers.js":12,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],15:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var backbone = require('backbone');
backbone.LocalStorage = require('backbone.localstorage');
var TransitionRouter = require('./routers/transition_Router.js');

$(function() {

  window.transition = new TransitionRouter();

  // TODO:
  // Using { pushState: true } requires thought-out server
  backbone.history.start(); 

});

},{"./routers/transition_Router.js":19,"backbone":"backbone","backbone.localstorage":"backbone.localstorage","jquery":"jquery"}],16:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var backbone = require('backbone');
var Model = require('../classes/Model.js');
var google = require('../helpers/google_helpers.js');

module.exports = Model.extend({

  defaults: {
    'name': null,
    'imageUrl': null,
    'email': null,
    'fullySignedIn': false
  },

  initialize: function () {

    console.log('Signing in...');

    // Initiate the Google OAuth2 API
    google.connect();

    // Listen for special Google events
    backbone.Events.listenTo.call(this, backbone, 'google:isSignedIn', this.toggle);
    backbone.Events.listenTo.call(this, backbone, 'google:isFullySignedIn', this.fully);

  },

  toggle: function (isSignedIn) {
    var profile;

    if (isSignedIn) {

      console.log('...signed in.');

      profile = google.profile();

      this.set({
        'id': profile.getId(),
        'name': profile.getName(),
        'imageUrl': profile.getImageUrl(),
        'email': profile.getEmail()
      });

    }

    else {
      console.log('...signed out.');
      this.clear();
    }

  },

  fully: function (status) {
    status && console.log('...fully signed in.');
    this.set({
      'fullySignedIn': status
    });
  },

  // temporary override
  promise: function () {
    return $.Deferred().resolveWith(this, [this.toJSON()]).promise();
  }

});

},{"../classes/Model.js":2,"../helpers/google_helpers.js":10,"backbone":"backbone","jquery":"jquery"}],17:[function(require,module,exports){
'use strict';

var backbone = require('backbone');
var Collection = require('../classes/Collection.js');

module.exports = Collection.extend({

  model: require('./tasks_Model.js'),
  
  localStorage: new backbone.LocalStorage('TasksApp')

});

},{"../classes/Collection.js":1,"./tasks_Model.js":18,"backbone":"backbone"}],18:[function(require,module,exports){
'use strict';

var backbone = require('backbone');
var Model = require('../classes/Model.js');

module.exports = Model.extend({

  defaults: {
    'due': null,
    'completed': null,
    'details': null,
    'created': null
  },

  check: function (bool) {

    var options = { wait: true }

    this.save({ 'completed': bool ? Date.now() : null }, options);

  },

  toggle: function () {

    !this.get('completed') ? this.check(true) : this.check(false);

  },

  validate: function (attributes) {

    if ('title' in attributes && attributes.title.length === 0) {
      return "Title cannot be empty.";
    }
    
  }

});

},{"../classes/Model.js":2,"backbone":"backbone"}],19:[function(require,module,exports){
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

var AccountModel = require('../models/account_Model.js');

module.exports =  new AccountModel();

},{"../models/account_Model.js":16}],21:[function(require,module,exports){
'use strict';

module.exports = undefined;

},{}],22:[function(require,module,exports){
'use strict';

var TasksCollection = require('../models/tasks_Collection.js');

module.exports = new TasksCollection();

},{"../models/tasks_Collection.js":17}],23:[function(require,module,exports){
'use strict';

var View = require('../classes/View.js');
var google = require('../helpers/google_helpers.js');

module.exports = View.extend({

  template: require('../../templates/account_card_template.html'),

  events: {
    'mouseup .back': 'back',
    'mouseup .home': 'home',
    'mouseup .forward': 'forward',
    'mouseup .grant': 'grant',
    'mouseup .signout': 'signout'
  },
  
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  back: function () {
     window.transition.back();
  },

  home: function () {
     window.transition.to('');
  },

  forward: function () {
     window.transition.forward();
  },

  grant: function () {
    google.grantOfflineAccess().then(google.postToServer);
  },

  signout: function () {
    google.signOut().then(transition.back);
  },

  render: function () {
    return View.prototype.render.call(this, function () {
      this.$el.hide().fadeIn();
    });
  }
  
});

},{"../../templates/account_card_template.html":29,"../classes/View.js":4,"../helpers/google_helpers.js":10}],24:[function(require,module,exports){
'use strict';

var View = require('../classes/View.js');
var google = require('../helpers/google_helpers.js');

module.exports = View.extend({

  template: require('../../templates/account_link_template.html'),

  events: {
    'mouseup .signin': 'signin',
    'mouseup .profile': 'profile'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  signin: function () {
    google.signIn();
  },

  profile: function () {
    window.transition.to('account/' + this.model.id);
  }

});

},{"../../templates/account_link_template.html":30,"../classes/View.js":4,"../helpers/google_helpers.js":10}],25:[function(require,module,exports){
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
    'mouseup .toggle': 'toggle',
    'mouseup .back': 'back',
    'mouseup .home': 'home',
    'mouseup .forward': 'forward',
    'mouseup .delete': 'delete',
    'blur #title-input': 'updateTitle',
    'blur #details-input': 'updateDetails'
  },
  
  initialize: function () {
    // May need to _.debounce render
    this.listenTo(this.model, 'change', this.render);
  },

  toggle: function () {
    this.model.toggle();
  },

  back: function () {
     window.transition.back();
  },

  home: function () {
     window.transition.to('');
  },

  forward: function () {
     window.transition.forward();
  },

  delete: function () {
    this.model.destroy();
    this.remove();
    this.back();
  },

  updateTitle: function () {
    this.model.save({
      'title': this.$('#title-input').val().trim()
    },
    { wait: true });
  },

  updateDetails: function () {
    this.model.save({
      'details': this.$('#details-input').val().trim()
    },
    { wait: true });
  }
  
});

},{"../../templates/tasks_card_template.html":32,"../classes/View.js":4,"underscore":"underscore"}],27:[function(require,module,exports){
'use strict';

var View = require('../classes/View.js');

module.exports = View.extend({

  template: require('../../templates/tasks_item_template.html'),

  events: {
    'mouseup .toggle' : 'toggle',
    'mouseup .open' : 'open',
    'mouseup .delete' : 'delete'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  toggle: function () {
    this.model.toggle();
  },

  open: function () {
     window.transition.to('tasks/' + this.model.id);
  },

  delete: function () {
    this.model.destroy();
    this.remove();
  }
  
});

},{"../../templates/tasks_item_template.html":33,"../classes/View.js":4}],28:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var View = require('../classes/View.js');
var ItemView = require('./tasks_item_View.js');
var codes = require('../config/keycodes_config.json');

module.exports = View.extend({

  template: require('../../templates/tasks_list_template.html'),

  events: {
    'mouseup .all' : 'check',
    'mouseup .clear' : 'remove',
    'keyup #input-title': 'enter'
  },

  check: function () {

    // Coax into boolean flag
    var flag = !!this.collection.find(function (model) {
      return !model.get('completed');
    });

    // Set all true if any flag otherwise set all false
    this.collection.each(function (model) {
      model.check(flag);
    });
  },

  enter: function (event) {
    if (event.which === codes['ENTER']) {
      var input = this.$('#input-title');
      this.collection.create({
        'created': Date.now(),
        'title': input.val().trim()
      },
      { wait: true });
      input.val('').blur();
      this.render();
    }
  },

  render: function () {
    
    return View.prototype.render.call(this, function () {
     
      var $fragment = $(document.createDocumentFragment());
      
      this.collection.each(function (item) {
        (new ItemView({ model: item })).insert($fragment);
      });

      $fragment.appendTo(this.$('ul#task-items'));

      this.$el.hide().fadeIn();
    
    });
  
  }

});

},{"../../templates/tasks_list_template.html":34,"../classes/View.js":4,"../config/keycodes_config.json":6,"./tasks_item_View.js":27,"jquery":"jquery"}],29:[function(require,module,exports){
module.exports = "<div class=\"app\">\n\n    <div class=\"mdl-card mdl-shadow--2dp\">\n\n      <div class=\"mdl-card__menu\">\n        <i class=\"material-icons\">fingerprint</i>\n      </div>\n\n      <div class=\"mdl-card__title\"></div>\n\n      <div class=\"mdl-card__supporting-text\">\n        <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n          <input class=\"mdl-textfield__input\" type=\"text\" disabled>\n          <label class=\"mdl-textfield__label\"><%- get('name') %></label>\n        </div>\n\n        <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n          <input class=\"mdl-textfield__input\" type=\"text\" disabled>\n          <label class=\"mdl-textfield__label\"><%- get('email') %></label>\n        </div>\n      </div>\n\n      <div class=\"mdl-card__actions mdl-card--border\">\n\n        <button class=\"mdl-button mdl-js-button mdl-button--icon back\">\n          <i class=\"material-icons\">arrow_back</i>\n        </button>\n\n        <button class=\"mdl-button mdl-js-button mdl-button--icon home\">\n          <i class=\"material-icons\">home</i>\n        </button>\n\n        <button class=\"mdl-button mdl-js-button mdl-button--icon forward\">\n          <i class=\"material-icons\">arrow_forward</i>\n        </button>\n\n        <a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect grant\">\n          Grant offline access\n        </a>\n\n        <a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect signout\">\n          Sign out\n        </a>\n\n      </div>\n\n    </div>\n\n</div>\n";

},{}],30:[function(require,module,exports){
module.exports = "<div>\n  <a id=\"account\" class=\"mdl-navigation__link <% has('id') ? print('profile') : print('signin') %>\">\n\n      <button class=\"mdl-button mdl-js-button mdl-button--icon\">\n        <%\n          has('id') ? \n          print('<img src='+get('imageUrl')+' width=\"32px\" height=\"32px\" />') :\n          print('<i class=\"material-icons\">fingerprint</i>')\n        %>\n      </button>\n\n  </a>\n</div>";

},{}],31:[function(require,module,exports){
module.exports = "<div>\n  <div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-header\">\n    <header class=\"mdl-layout__header mdl-layout__header--transparent\">\n      <div class=\"mdl-layout__header-row\">\n        <!-- <span class=\"mdl-layout-title\">Title</span> -->\n        <div class=\"mdl-layout-spacer\"></div>\n        <nav class=\"mdl-navigation mdl-layout--large-screen-only\" data-region=\"header\"></nav>\n      </div>\n    </header>\n    <main class=\"mdl-layout__content\">\n      <div class=\"page-content\" data-region=\"content\"></div>\n    </main>\n    <div data-region=\"footer\"></div>\n  </div>\n</div>";

},{}],32:[function(require,module,exports){
module.exports = "<div class=\"app\">\n\n    <div class=\"mdl-card mdl-shadow--2dp\">\n\n      <div class=\"mdl-card__menu\">\n        <i class=\"material-icons\"><% has('completed') ? print('check_box') : print('check_box_outline_blank') %></i>\n      </div>\n\n      <div class=\"mdl-card__title\"></div>\n\n      <div class=\"mdl-card__supporting-text\">\n        <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n          <input class=\"mdl-textfield__input\" type=\"text\" id=\"title-input\" length=\"23\" <% has('completed') && print('disabled')%> >\n          <label class=\"mdl-textfield__label\" for=\"title-input\"><%- get('title') %></label>\n        </div>\n\n        <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n          <textarea class=\"mdl-textfield__input\" type=\"text\" rows= \"1\" id=\"details-input\" <% has('completed') && print('disabled')%>></textarea>\n          <label class=\"mdl-textfield__label\" for=\"details-input\"><% has('details') ? print(get('details')) : print(\"Add details\") %></label>\n        </div>\n      </div>\n\n      <div class=\"mdl-card__actions mdl-card--border\">\n\n        <button class=\"mdl-button mdl-js-button mdl-button--icon back\">\n          <i class=\"material-icons\">arrow_back</i>\n        </button>\n\n        <button class=\"mdl-button mdl-js-button mdl-button--icon home\">\n          <i class=\"material-icons\">home</i>\n        </button>\n\n        <button class=\"mdl-button mdl-js-button mdl-button--icon forward\">\n          <i class=\"material-icons\">arrow_forward</i>\n        </button>\n        \n        <a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect delete\">\n          Delete\n        </a>\n\n        <a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect toggle\">\n          Toggle Completion\n        </a>\n\n      </div>\n\n    </div>\n\n</div>\n";

},{}],33:[function(require,module,exports){
module.exports = "<li>\n  <div class=\"mdl-card mdl-shadow--2dp\">\n    <div class=\"mdl-card__supporting-text\">\n\n    <div class=\"avatar-wrapper left right\">\n\n      <div class=\"avatar left\">\n        <label class=\"mdl-checkbox mdl-js-checkbox toggle\" for=\"checkbox-<%- get('id') %>\">\n          <input type=\"checkbox\" id=\"checkbox-<%- get('id') %>\" class=\"mdl-checkbox__input\" <% has('completed') && print('checked') %>>\n        </label>\n      </div>\n\n      <p class=\"open <% has('completed') && print('completed') %>\"><%- get('title') %></p>\n\n      <span>\n        <% has('details') && print(get('details'), '<br>') %>\n        <% print(format('created'), '<br>') %>\n        <% has('due') && print(format('due'), '<br>') %>\n        <% has('completed') && print(format('completed')) %>\n      </span>\n\n      <div class=\"avatar right\">\n        <button class=\"mdl-button mdl-js-button mdl-button--icon delete\">\n          <i class=\"material-icons\">delete</i>\n        </button>\n      </div>\n\n    </div>\n\n    </div>\n  </div>\n</li>";

},{}],34:[function(require,module,exports){
module.exports = "<div class=\"app\">\n\n  <div class=\"avatar-wrapper right\">\n    <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n      <input class=\"mdl-textfield__input\" type=\"text\" id=\"input-title\" length=\"23\">\n      <label class=\"mdl-textfield__label\" for=\"input-title\">What needs to be done?</label>\n    </div>\n\n    <div class=\"avatar-fab right\">\n      <button class=\"mdl-button mdl-js-button mdl-button--fab all\">\n        <i class=\"material-icons\">done_all</i>\n      </button>\n    </div>\n  </div>\n  \n  <ul id=\"task-items\"></ul>\n\n</div>\n";

},{}]},{},[15]);
