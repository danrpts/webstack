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

var _ = require('underscore');

var backbone = require('backbone');

module.exports = {

  sync: function (method, model, options) {

    var jqXHR = backbone.Collection.prototype.sync.apply(this, arguments);

    if (this.isResolved()) this.promise = jqXHR.promise();

    //console.log('5: sync called');

    return jqXHR;

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

},{"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],6:[function(require,module,exports){
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

  freeView: function (selector) {

    this.freeViews(selector);

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

var _ = require('underscore');

var backbone = require('backbone');

module.exports = {

  // Wrapper around "low-level" rest helper to set/reset the promise
  sync: function (method, model, options) {

    // Reset the promise
    this.promise = $.Deferred();

    return this.promise = backbone.Model.prototype.sync.apply(this, arguments);

  },

  // Custom "low-level" rest helper to trigger a data-handling process on the server for the resource
  procedure: function (name, options) {

      options = _.extend({parse: true}, options);

      // Inject the procedure name into the uri and call save (save is our existing POST method)
      options.url = this.url().replace(/[^\/]$/, '$&/') + encodeURIComponent(name);

      var model = this;
    
      var success = options.success;

      options.success = function(resp) {
        if (success) success.call(options.context, model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      
      // Todo: figure out how to use wrapError from this context
      //wrapError(this, options);
      
      return this.sync('create', this, options);

  },

  // This helper lets us populate the model's attributes on the fly;
  // Useful if the normal getter is expensive and we only want to run it once
  // and store its result at an easier place;
  // It is find of like a cache miss
  fault: function (attr, get, context) {

    context = context || this;

    var value = _.isFunction(get) ? get.call(context) : get; 

    // Condensed if/else; set returns model so we negate to return value
    return this.get(attr) || ! this.set(attr, value, { silent: true }) || value;

  },

  isPending: function () {
    return !! this.promise && this.promise.state() === 'pending';
  },

  isResolved: function () {
    return !! this.promise && this.promise.state() === 'resolved';
  }
  
}

},{"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],8:[function(require,module,exports){
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

var _ = require('underscore');

var backbone = require('backbone');

module.exports = {
  
  to: function (fragment, options) {
    options = options || {};
    _.defaults(options, {
      trigger: true
    }) 
    fragment = fragment || '';
    if (fragment === '<') this.back();
    else if (fragment === '>') this.forward();
    else backbone.Router.prototype.navigate.call(this, fragment, options);
  },

  back: function () {
    window.history.back();
  },

  forward: function () {
    window.history.forward();
  }

}

},{"backbone":"backbone","underscore":"underscore"}],10:[function(require,module,exports){
module.exports={
  "client_id": "942671175535-6eon0fq1rst4oop13al4l0hasephc55c.apps.googleusercontent.com",
  "scope": "https://mail.google.com/",
  "redirect_uri": "postmessage"
}
},{}],11:[function(require,module,exports){
module.exports={
  "backspace": 8,
  "enter": 13
}
},{}],12:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var AccountPage = require('../views/Account_Page.js');

var $region = $('body');

module.exports = function (id, options) {

  this.authenticate()

  .done(function(account) {

    options = options || {};

    // Do this first so events aren't caught on old view
    if (this.active) this.active.remove();

    var account = require('../singletons/account.js');

    account.fetch(id);

    var accountPage = new AccountPage({ model: account });

    this.active = accountPage;

    accountPage.render().$el.appendTo($region);

  })

  .fail(function (account) {

    //console.log("Not signed in...");

    this.to('login');
  
  });

}

},{"../singletons/account.js":23,"../views/Account_Page.js":29,"jquery":"jquery"}],13:[function(require,module,exports){
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
},{"../views/Login_Page.js":33,"jquery":"jquery"}],14:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var $region = $('body');

module.exports = function (id, options) {

  this.authenticate()

  .done(function(account) {

    options = options || {};

    // Do this first so events aren't caught on old view
    if (this.active) this.active.remove();

    var search = require('../singletons/search.js');

    // Check the search bar for state
    var queries = search.getValues();

    // Thought: Maybe trade the account as a token for the messages
    var messages = require('../singletons/messages.js');

    // Only fetch collection in the handler when:
    // 1) It's initially empty (viewed draft directly via url),
    // 2) Or we viewed a message directly via the url
    // Otherwise we may call refresh directly from a click event.
    if (messages.isEmpty() || messages.length < 2) messages.refresh(queries, options);
    
    // Use our helper to find the message
    if (id) var message = messages.lookup(id);

    var MessagesPage = require('../views/Messages_Page.js');

    // Fetch before view creation so that it misses the request event
    var messagesPage = new MessagesPage({ model: message });

    this.active = messagesPage;

    // The initial render will miss the initial request event by design
    messagesPage.render().$el.appendTo($region);

  })

  .fail(function (account) {

    //console.log("Not signed in...");

    this.to('login');
  
  });

}

},{"../singletons/messages.js":24,"../singletons/search.js":25,"../views/Messages_Page.js":36,"jquery":"jquery","underscore":"underscore"}],15:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var backbone = require('backbone');

backbone.LocalStorage = require('backbone.localstorage');

var Router = require('./routers');

$(function() {

  window.transition = new Router();

  // local hrefs send to the router
  $(document).on('click', '[href^="/"]', function (event) {

    var href = $(event.currentTarget).attr('href')

    !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey
      && event.preventDefault();

    var fragment = href.replace(/^\//, '').replace('\#\!\/', '');

    window.transition.to(fragment);

    return false;

  });

  var routeFound = backbone.history.start({ pushState: true });

  if (! routeFound) window.transition.to('');
 

});

},{"./routers":21,"backbone":"backbone","backbone.localstorage":"backbone.localstorage","jquery":"jquery"}],16:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var Model = require('../../../architecture/classes/Model.js');

var Collection = require('../../../architecture/classes/Collection.js');

module.exports = Model.extend({

  defaults: {
    'checked': false,
  },

  toggleChecked: function () {
    var value = ! this.get('checked');
    this.set({ checked: value });
    return value;
  },

  isChecked: function () {
    return !! this.get('checked');
  },

  setChecked: function (value, options) {
    this.set('checked', !! value, options);
  }
  
});

},{"../../../architecture/classes/Collection.js":1,"../../../architecture/classes/Model.js":2,"jquery":"jquery"}],17:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var Model = require('../../../architecture/classes/Model.js');

var Collection = require('../../../architecture/classes/Collection.js');

// Notice Chip is a private model
var Chip = Model.extend({

  defaults: {
    'value': undefined,
  },

  getValue: function () {
    return this.get('value');
  }
  
});

module.exports = Collection.extend({

  model: Chip,

  getValues: function () {
    return this.invoke('getValue');
  }
  
});

},{"../../../architecture/classes/Collection.js":1,"../../../architecture/classes/Model.js":2,"jquery":"jquery"}],18:[function(require,module,exports){
'use strict';

// Todo: fix the ugly promise anti-patterns in this code

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

  getFirstName: function () {
    return this.get('name').split(' ')[0]; 
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

    console.log('Signing out of Google...');

    gAuth.

    done(function (service) {

      service.
    
      signOut().

      then(function () {

        console.log('...signed out.');

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

},{"../../../architecture/classes/Model.js":2,"../config/google.json":10,"../services/gAuth.js":22,"jquery":"jquery","underscore":"underscore"}],19:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var humanTime = require('human-time');

var Checkbox = require('./Checkbox.js')

module.exports = Checkbox.extend({

  urlRoot: 'https://www.googleapis.com/gmail/v1/users/me/messages',

  defaults : {
    'id' : undefined,
    'threadId' : undefined
  },

  /* "Low level" REST wrappers; Think of these as priming the default functions */

  // Todo: clean this up because they are all doing the same thing
  // maybe by creating a way to set beforeSend on the model and the 
  // arch sets it up to be used on each sync

  // GET
  fetch: function (options) {

    var account = require('../singletons/account.js');
    
    options = options || {};

    var beforeSend = options.beforeSend;
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      if (beforeSend) return beforeSend.apply(this, arguments);
    }
    
    return Checkbox.prototype.fetch.call(this, options);

  },

  // DELETE
  destroy: function () {

    var account = require('../singletons/account.js');

    options = options || {};

    var beforeSend = options.beforeSend;
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      if (beforeSend) return beforeSend.apply(this, arguments);
    }

    Checkbox.prototype.destroy.call(this, options);
  },

  // POST / PUT
  save: function (key, val, options) {

    var account = require('../singletons/account.js');
    
    options = options || {};

    console.log(options);

    var beforeSend = options.beforeSend;
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      if (beforeSend) return beforeSend.apply(this, arguments);
    }
    
    // Call prototype save w/o attr
    return Checkbox.prototype.save.call(this, key, val, options);

  },

  // POST
  procedure: function (name, options) {

    var account = require('../singletons/account.js');
    
    options = options || {};

    var beforeSend = options.beforeSend;
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      if (beforeSend) return beforeSend.apply(this, arguments);
    }
  
    return Checkbox.prototype.procedure.call(this, name, options);

  },

  /* "High Level" message procedures */

  // Higher level POST operation
  trash: function () {

    var messages = require('../singletons/messages.js');

    // Immediately remove for perceived performance
    messages.remove(this);

    // Then invoke the remote procedure
    this.procedure('trash');

    // If error add back to collection and handle error
  
  },

  // Higher level POST operation
  send: function () {

    // Build rfc message from attributes
    var body = '';

    body += 'From: <' + this.get('from') + '>' + '\r\n';
    body += 'To: <' + this.get('to') + '>' + '\r\n';
    body += 'Subject: ' + this.get('subject') + '\r\n';
    body += 'Date: ' + new Date().toUTCString(); + '\r\n\n';
    
    body += this.get('body'); + '\r\n\n';
    
    // Then invoke the remote procedure
    //this.procedure('send');
    console.log(body);
  
  },

  /* "High Level" message procedures */

  // Todo: Keep marked as unread (unprocesses), goto next message
  // Higher level NOOP operation
  ignore: function () {},

  // Todo: Open dialog to send to someone else, goto next message
  // Higher level POST operation
  forward: function () {},

  // Todo: Mark as read (processed), open message in composer in reply mode
  // Higher level POST operation
  respond: function () {},


  /* Payload helpers */

  // Check message for google type label
  hasLabel: function (label) {

    var labels = this.get('labelIds');

    return !! labels && labels.indexOf(label.toUpperCase()) > -1;

  },

  // Extract headers from message payload
  getHeaders: function () {

    var payload = this.get('payload');

    // Cache the result
    return !! payload && _.memoize(function () {

      var names = _.pluck(payload.headers, 'name');

      var values = _.pluck(payload.headers, 'value');

      return _.object(names, values);

    })();

  },

  // Extract body from message headers
  // Todo: Needs work or rewrite, does not handle all message body types
  getBody: function () {

    function recursePayload (payload) {

      return (payload.mimeType === 'text/html') 

      ? payload.body.data

      : _.reduce(payload.parts, function (memo, part) {
        
        return memo || recursePayload(part);

      }, undefined);

    }

    var payload = this.get('payload');

    // Cache the result
    return !! payload && _.memoize(function () {

      var body = recursePayload(payload).

      replace(/-/g, '+').

      replace(/_/g, '/').
      
      replace(/\s/g, '');

      return window.atob(body);

    })();

  },

  isUnread: function () {
  
    return this.hasLabel('unread');
  
  },

  // Todo: Actually check for message attachment
  hasAttachment: function () {
  
    return true;

  },

  isHtml: function () {

    var payload = this.get('payload');
    
    return (payload.mimeType === 'text/html');

  },

  getHeader: function (name) {
    var header = this.getHeaders()[name];
    return ! header ? '(No ' + name + ')' : header.replace(/['"]+/g, '');

  },

  /* Attribute helpers */

  getDate: function () {
  
    return this.fault('date', function () {

      return this.getHeader('Date');
    
    });
  
  },

  getHumanDate: function () {
  
    return new Date(this.getDate()).toDateString();
  
  },

  getTimeAgo: function () {

    return humanTime(new Date(this.getDate()));
  
  },

  getSubject: function () {
  
    return this.fault('subject', function () {

      return this.getHeader('Subject');
    
    });

  },

  getFrom: function () {

    return this.fault('from', function () {

      // Set default
      var name = '(No From)';
      var email = this.getHeader('From');

      // Extract email and name
      var start = email.indexOf('<');
      if (start != -1) {

        // Remove quotes
        email = email.replace(/['"]+/g, '');

        // Pivot backwards for name
        var spaced = email.substring(0, start-1);
        name = ! spaced ? name : spaced;

        // Pivot forwards for email
        var end = email.indexOf('>', start);
        var bracketed = email.substring(start+1, end);
        email = ! bracketed ? email : bracketed;
      }

      return [name, email];

    });

  },

  getTo: function () {

    return this.fault('to', function () {

      // Set default
      var name = this.getHeader('To');

      // Extract email address
      var start = name.indexOf('<');
      if (start != -1) {

          // Pivot forwards for email
          var end = name.indexOf('>', start);
          var bracketed = name.substring(start+1, end);
          name = ! bracketed ? name : bracketed;
      }
    
      return name;

    });

  },

  getSnippet: function () {
    
    return this.get('snippet');

  }

});

},{"../singletons/account.js":23,"../singletons/messages.js":24,"./Checkbox.js":16,"human-time":"human-time","jquery":"jquery","underscore":"underscore"}],20:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var Collection = require('../../../architecture/classes/Collection.js');

module.exports = Collection.extend({

  url: 'https://www.googleapis.com/batch',

  model: require('./Google_Message.js'),

  // Prefetch the message ids first.
  prefetch: function (data) {

    //console.log('4: prefetch called');

    var deferred = $.Deferred();

    var collection = this;

    var account = require('../singletons/account.js');

    var options = {
      url: 'https://www.googleapis.com/gmail/v1/users/me/messages',
      type: 'GET',
      dataType: 'json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      },
      success: function (result) {
        collection._nextPageToken = result.nextPageToken;
        deferred.resolveWith(collection, [result.messages]);
      }
    }

    // Query string
    if (data) options.data = data;

    $.ajax(options);
    
    return deferred;

  },

  // Batch fetch messages using the prefetched ids.
  fetch: function (options) {
    
    //console.log('3: fetch called');

    /* Invarient: Prefetch, deferred and promise are undefined */

    // Set a context for callbacks
    var collection = this;

    // Initiate overall status
    var deferred = $.Deferred();
    this.promise = deferred.promise();

    /* Invarient: Prefetch is undefined while deferred and promise are pending */

    // Issue the prefetch to retreive message ids
    options = options || {};
    var prefetch = this.prefetch(options.data);

    /* Invarient: Prefetch is indeterminate while deferred and promise are pending */

    // Trigger the batch request event while all are unresolved
    this.trigger('batch:request', collection, deferred, options);

    // Override fetch options
    _.extend(options, {
      type: 'POST',
      dataType: 'text',
      data: undefined,
    });

    // Default fetch options
    _.defaults(options, {
      reset: true
    });

    // Set auth headers
    var boundary = 'batch_' + _.random(Math.pow(2, 16));
    var account = require('../singletons/account.js');
    var beforeSend = options.beforeSend;
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + account.get('token'));
      xhr.setRequestHeader('Content-Type', 'multipart/mixed; boundary="' + boundary + '"');
      if (beforeSend) return beforeSend.apply(this, arguments);
    }

    // Once we have the message ids
    prefetch.done(function (ids) {

      /* Invarient: Prefetch is resolved while deferred and promise are pending */

      // Fetch each message
      if (!! ids) {

        // Form the batch request
        var body = '';
        ids.forEach(function (message) {
          body += '--' + boundary + '\r\n';
          body += 'Content-Type: application/http' + '\r\n\n';
          body += 'GET /gmail/v1/users/me/messages/' + message.id + '\r\n\n';
        });
        body += '--' + boundary + '--';
        options.data = body;

        options.success = function (result) {
          
          /* Invarient: Prototype fetch is resolved */
          
          deferred.resolveWith(collection, [result]);

          /* Invarient: Prefetch, deferred and promise are resolved */

          // Trigger the batch sync event once all are resolved
          collection.trigger('batch:sync', collection, deferred, options);   

        }

        // Fetch the messages and pipe the deferred state
        Collection.prototype.fetch.call(collection, options);

      } 

      // Spoof the sync when there aren't any message ids
      else {
        deferred.resolveWith(collection, []);

        /* Invarient: Prefetch, deferred and promise are resolved */
        
        collection.reset();
        collection.trigger('batch:sync', collection, deferred, options);  
      }

    });

    return deferred;

  },

  // Todo: Needs rewrite
  parse: function(response) {

    // Not the same delimiter in the response as we specify ourselves in the request,
    // so we have to extract it.
    var delimiter = response.substr(0, response.indexOf('\r\n'));

    var parts = response.split(delimiter);
    
    // The first part will always be an empty string. Just remove it.
    parts.shift();
    
    // The last part will be the "--". Just remove it.
    parts.pop();

    var result = [];
    
    for (var i = 0; i < parts.length; i++) {

      var part = parts[i];
      
      var p = part.substring(part.indexOf("{"), part.lastIndexOf("}") + 1);
      
      result.push(JSON.parse(p));
    
    }

    return result;
  
  },

  // Keep the list sorted by date
  comparator: function(model) {
    var date = new Date(model.getHeader('Date'));
    return -date.getTime();
  },

  // Group the list by time makingknowing the list is already sorted
  groupByDate: function (callback) {
    this.chain().groupBy(function (message) {
      return message.getTimeAgo();
    })
    .mapObject(function (messages, timeago) {
      var unreadCount = messages.reduce(function (memo, message) { 
        return memo + (message.isUnread() ? 1 : 0);
      }, 0);
      callback(messages, timeago, unreadCount);  
    });
  },

    // Local collection filtering
  filter: function (pattern, options) {

    // TODO: Implement collection filtering for pattern

  },

  // Remote collection fetching
  search: function (queries, options) {
    
    //console.log('2: search called');

    options = options || {};

    _.extend(options, {
      data: $.param({ q: queries.join(' ') }),    
    });

    return this.fetch(options);
  
  },

  refresh: function (queries, options) {
    
    //console.log('1: refresh called');

    return this.search.apply(this, arguments);
  
  },

  hasMore: function() {
    return (!! this._nextPageToken);
  },

  more: function (nextPageToken, options) {

    nextPageToken = nextPageToken || this._nextPageToken;

    options = options || {};

    // Note the usage of "reset: false" which tells backbone to do a collection.set
    // and then "remove: false" tells set to not remove any stale models. Essentially,
    // this works implictly as a collection.push, but with our existing fetch method.
    _.extend(options, {
      data: $.param({ pageToken: nextPageToken }),
      reset: false,
      remove: false
    });

    return this.fetch(options);

  },

  getChecked: function () {
    return this.where({ checked: true });
  },

  getUnread: function () {

    return this.filter(function (message) {
    
      return message.isUnread();
  
    });
  
  }
    
});

},{"../../../architecture/classes/Collection.js":1,"../singletons/account.js":23,"./Google_Message.js":19,"jquery":"jquery","underscore":"underscore"}],21:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var Router = require('../../../architecture/classes/Router.js');

module.exports = Router.extend({

  routes: {
    '':              require('../handlers/messages.js'),
    'login':         require('../handlers/login.js'),
    'messages/:id':  require('../handlers/messages.js'),
    'account(/:id)': require('../handlers/account.js')
  },

  authenticate: function () {

    var router = this;

    var deferred = $.Deferred();

    var account = require('../singletons/account.js');

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

},{"../../../architecture/classes/Router.js":3,"../handlers/account.js":12,"../handlers/login.js":13,"../handlers/messages.js":14,"../singletons/account.js":23,"jquery":"jquery","underscore":"underscore"}],22:[function(require,module,exports){
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

},{"../config/google.json":10,"jquery":"jquery","underscore":"underscore"}],23:[function(require,module,exports){
'use strict';

var GoogleAccount = require('../models/Google_Account.js');

module.exports = new GoogleAccount();

},{"../models/Google_Account.js":18}],24:[function(require,module,exports){
'use strict';
 
var GoogleMessages = require('../models/Google_Messages.js');

module.exports = new GoogleMessages();

},{"../models/Google_Messages.js":20}],25:[function(require,module,exports){
'use strict';

var Chips = require('../models/Chips.js');

module.exports = new Chips();

},{"../models/Chips.js":17}],26:[function(require,module,exports){
'use strict';

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/account_actions.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  }
  
});
},{"../../../architecture/classes/View.js":4,"../../templates/account_actions.html":42}],27:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/account_bar.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  }

});

},{"../../../architecture/classes/View.js":4,"../../templates/account_bar.html":43,"jquery":"jquery","underscore":"underscore"}],28:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

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

},{"../../../architecture/classes/View.js":4,"../../templates/account_card.html":44,"jquery":"jquery","underscore":"underscore"}],29:[function(require,module,exports){
'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/account_page.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  defaultViews: {
    'header': 'accountBar',
    'main': 'accountCard',
    'footer': 'accountActions'
  },

  accountBar: function () {
    var AccountBar = require('./Account_Bar.js');
    return new AccountBar({ model: this.model });
  },

  accountCard: function () {
    var AccountCard = require('./Account_Card.js');
    return new AccountCard({ model: this.model });
  },

  accountActions: function () {
    var AccountActions = require('./Account_Actions.js');
    return new AccountActions({ model: this.model });
  }

});

},{"../../../architecture/classes/View.js":4,"../../templates/account_page.html":45,"./Account_Actions.js":26,"./Account_Bar.js":27,"./Account_Card.js":28,"underscore":"underscore"}],30:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

var keycodes = require('../config/keycodes.json');

// Notice ChipsList is a private child view
var ChipsList = View.extend({

  template: require('../../templates/chips_list.html'),

  initialize: function () {
    this.listenTo(this.collection, 'update', this.render);
  },

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  events: {
    'click .chip-delete': 'onDeleteClick'
  },

  onDeleteClick: function (event) {
    var cid = event.currentTarget.id;
    this.collection.remove(cid);
  }

});

module.exports = View.extend({

  template: require('../../templates/chips_input.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  defaultViews: {
    '#chips-list': 'newChipsList'
  },
  
  newChipsList: function () {
    return new ChipsList({ collection: this.collection });
  },

  events: {
    'keydown #chips-input': 'onInputKeydown'
  },

  // Todo: fetch data list items and find select event
  onInputSelect: function (event) {},

  onInputEnter: function (event) {
    var $input = this.$(event.currentTarget);
    var value = $input.val().trim();
    var collection = this.collection;
    var attributes = { value: value };
    if (!!value && !collection.findWhere(attributes)) {
      collection.push(attributes);
      $input.val('');
    }
  },

  onInputBackspace: function (event) {
    var $input = this.$(event.currentTarget);
    var value = $input.val();
    if (!value) this.collection.pop();
  },

  onInputKeydown: function (event) {
    switch (event.which) {
      case keycodes['backspace']: this.onInputBackspace.apply(this, arguments); break;
      case keycodes['enter']: this.onInputEnter.apply(this, arguments); break;
    }
  }

});

},{"../../../architecture/classes/View.js":4,"../../templates/chips_input.html":46,"../../templates/chips_list.html":47,"../config/keycodes.json":11,"jquery":"jquery","underscore":"underscore"}],31:[function(require,module,exports){
'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/compose_sheet.html')

});

},{"../../../architecture/classes/View.js":4,"../../templates/compose_sheet.html":48,"underscore":"underscore"}],32:[function(require,module,exports){
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
},{"../../../architecture/classes/View.js":4,"../../templates/login_card.html":49,"underscore":"underscore"}],33:[function(require,module,exports){
'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/login_page.html'),

  prerender: function () {},

  postrender: function () {},

  defaultViews: {
    'main': 'loginCard'
  },

  loginCard: function () {
    var LoginCard = require('./Login_Card.js');
    return new LoginCard({ model: this.model });
  },

  shareCard: function () {
    var ShareCard = require('./Share_Card.js');
    return new ShareCard();
  },

  events: {
    'click #login-share': 'onShareClick',
    'click #share-back': 'onBackClick'
  },

  onShareClick: function () {
    this.setView(this.shareCard(), 'main');
  },

  onBackClick: function () {
    this.setView(this.loginCard(), 'main');
  }

});
},{"../../../architecture/classes/View.js":4,"../../templates/login_page.html":50,"./Login_Card.js":32,"./Share_Card.js":40,"underscore":"underscore"}],34:[function(require,module,exports){
'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/message_sheet.html'),

  initialize: function () {
    this.listenTo(this.model, 'request', this.render);
    this.listenTo(this.model, 'sync', this.render);
  },

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  }

});

},{"../../../architecture/classes/View.js":4,"../../templates/message_sheet.html":51,"underscore":"underscore"}],35:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/messages_list.html'),

  initialize: function () {

    // Created own events because the google messages api requires two ajax calls
    this.listenTo(this.collection, 'batch:request', this.render);
    this.listenTo(this.collection, 'batch:sync', this.render);

    // Trigger reredner for things such as removes, merges, etc...
    this.listenTo(this.collection, 'update', this.render);
  },

  postrender: function () {
    
    console.log("Rendering messages list of size %i and is pending %s", this.collection.length, this.collection.isPending());
    
    componentHandler.upgradeElements(this.el);
  },

  events: {
    'click #more': 'onMoreClick'
  },

  // Fire first then ignore button mash for one second
  onMoreClick: _.debounce(function () {
    this.collection.more();
  }, 1000, true)

});

},{"../../../architecture/classes/View.js":4,"../../templates/messages_list.html":52,"jquery":"jquery","underscore":"underscore"}],36:[function(require,module,exports){
'use strict';

var $ = require('jquery');

require('jquery-ui-browserify');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/messages_page.html'),

  postrender: function () {

    // Only when there is a message to display, shall we
    if (!! this.model) {
      this.showMessageSheet();
    }

    componentHandler.upgradeElements(this.el);

  },

  defaultViews: {
    '[data-region="drawer"]': 'navSheet',
    '[data-region="content"]': 'messagesSheet'
  },

  navSheet: function () {
    var account = require('../singletons/account.js');
    var NavSheet = require('./Nav_Sheet.js');
    return new NavSheet({ model: account });
  },

  searchInput: function () {
    var search = require('../singletons/search.js');
    var SearchInput = require('./Search_Input.js');
    return new SearchInput({ collection: search });
  },

  messagesSheet: function () {
    var messages = require('../singletons/messages.js');
    var MessagesSheet = require('./Messages_Sheet.js');
    return new MessagesSheet({ collection: messages });
  },

  messageSheet: function () {
    var MessageSheet = require('./Message_Sheet.js');
    return new MessageSheet({ model: this.model });
  },

  composeSheet: function () {
    var ComposeSheet = require('./Compose_Sheet.js');
    return new ComposeSheet({ model: this.model });
  },

  events: {
    'click #compose': 'onComposeClick',
    'click [href^="/messages"]': 'onHrefMessageClick',
    'click #close': 'onCloseSecondaryClick',
    'click #trash': 'onTrashMessageClick'
  },

  hideSecondarySheet: function () {
    var $el = this.$('.resizable');
    $el.hide();
  },

  showComposeSheet: function () {
    var $el = this.$('.resizable');
    $el.resizable({
      handles: { 
        w : '.ui-resizable-w'
      }
    });
    this.setView(this.composeSheet(), '[data-region="secondary"]');
    $el.show();
  },

  showMessageSheet: function () {
    var $el = this.$('.resizable');
    $el.resizable({
      handles: { 
        w : '.ui-resizable-w'
      }
    });
    this.setView(this.messageSheet(), '[data-region="secondary"]');
    $el.show();
  },

  showNextMessageSheet: function () {
    var previous = this.model;
    var messages = require('../singletons/messages.js');
    var index = messages.indexOf(previous);
    console.log(index);
    if (index > -1) {
      this.model = messages.at(index+1);
    }
    else {
      this.model = messages.first();
    }
    this.showMessageSheet();
    return previous;
  },

  onComposeClick: function () {
    var GoogleMessage = require('../models/Google_Message.js');
    this.model = new GoogleMessage();
    this.showComposeSheet();
  },

  // Intercept href single clicks coming from the message sheet
  onHrefMessageClick: function(event) {
    event.preventDefault();
    event.stopPropagation();
    var href = $(event.currentTarget).attr('href')
    var fragment = href.replace(/^\//, '').replace('\#\!\/', '');
    var id = fragment.replace('messages\/', '');
    var messages = require('../singletons/messages.js');
    this.model = messages.lookup(id);
    this.showMessageSheet();
    //window.transition.to(fragment, { trigger: false });
    return false;
  },

  // Notice how we handle the secondary close event within context of the messages page
  onCloseSecondaryClick: function () {

    // So that we can do view composition here,
    this.model = undefined;

    // Update the url (do not navigate)
    //window.transition.to('', { trigger: false });

    // And simply hide the secondary sheet instead of re-redering the whole page
    this.hideSecondarySheet();

    // Allow propogation
    return true;
  },

  onTrashMessageClick: function () {

    // Immediately show the next message
    var previous = this.showNextMessageSheet();

    // Update the url (do not navigate)
    window.transition.to('', { trigger: false });

    // Then trash the previous model
    previous.trash();

    // Allow propogation
    return true;
  }

});

},{"../../../architecture/classes/View.js":4,"../../templates/messages_page.html":53,"../models/Google_Message.js":19,"../singletons/account.js":23,"../singletons/messages.js":24,"../singletons/search.js":25,"./Compose_Sheet.js":31,"./Message_Sheet.js":34,"./Messages_Sheet.js":37,"./Nav_Sheet.js":38,"./Search_Input.js":39,"jquery":"jquery","jquery-ui-browserify":"jquery-ui-browserify","underscore":"underscore"}],37:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var keycodes = require('../config/keycodes.json');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/messages_sheet.html'),

  initialize: function () {

    var search = require('../singletons/search.js');

    // Update the collection when chips are added to the search collection.
    this.listenTo(search, 'update', function (_, options) {

      return this.collection.refresh(search.getValues(), options);
    
    });
  
  },

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  defaultViews: {
    '[data-region="search-input"]': 'newSearchInput',
    '[data-region="messages-list"]': 'newMessagesList'
  },

  newSearchInput: function () {

    // Notice search is a chips type collection
    var search = require('../singletons/search.js');

    var SearchInput = require('./Search_Input.js');
    
    return new SearchInput({ collection: search });

  },

  newMessagesList: function () {

    var MessagesList = require('./Messages_List.js');
  
    return new MessagesList({ collection: this.collection });
  
  },

  events: {
    'click #more': 'onMoreClick',
    'keyup #search': 'onSearchKeyup'
  },

  onSearchKeyup: function (event) {

    var $el = $(event.currentTarget);
    
    var query = $el.val().trim();
  
    if (keycodes['enter'] === event.which) this.collection.search([ query ]);
  
  }

});

},{"../../../architecture/classes/View.js":4,"../../templates/messages_sheet.html":54,"../config/keycodes.json":11,"../singletons/search.js":25,"./Messages_List.js":35,"./Search_Input.js":39,"jquery":"jquery","underscore":"underscore"}],38:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/nav_sheet.html'),

  events: {
    'click #avatar': 'onAvatarClick',
    'click .label': 'onLabelClick'
  },

  // Temporary way to signout and clear global messages
  onAvatarClick: function () {
    var messages = require('../singletons/messages.js');

    // Todo: clean up promise anti-pattern and use a callback directly
    this.model.signOut().then(function () {
      messages.reset();
      window.transition.to('/login');
    });
  },

  // When a navigation link is clicked
  onLabelClick: function (event) {

    var messages = require('../singletons/messages.js');

    // Grab the label
    var label = $(event.currentTarget).text().trim().toLowerCase();
    
    // And trasparently run a search query (unlike the chips style of searching)
    messages.search([ 'in:' + label ]);

  }

});
},{"../../../architecture/classes/View.js":4,"../../templates/nav_sheet.html":55,"../singletons/messages.js":24,"jquery":"jquery","underscore":"underscore"}],39:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var ChipsInput = require('./Chips_Input.js');

module.exports = ChipsInput.extend({

  template: require('../../templates/search_input.html'),
  
  events: {
    'keydown #chips-input': 'onInputKeydown'
  },

  onInputEnter: function (event) {
    var $input = this.$(event.currentTarget);
    var value = $input.val().trim();
    var collection = this.collection;
    var attributes = { value: value };
    if (!!value && !collection.findWhere(attributes)) {
      collection.push(attributes);
      $input.val('');
    }
  },

  onInputBackspace: function (event) {
    var $input = this.$(event.currentTarget);
    var value = $input.val();
    if (!value) this.collection.pop();
  },

  onInputKeydown: function (event) {
    switch (event.which) {
      case keycodes['backspace']: this.onInputBackspace.apply(this, arguments); break;
      case keycodes['enter']: this.onInputEnter.apply(this, arguments); break;
    }
  }

});

},{"../../templates/search_input.html":56,"./Chips_Input.js":30,"jquery":"jquery","underscore":"underscore"}],40:[function(require,module,exports){
'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/share_card.html'),

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  defaultViews: {
    '#share-input': 'shareChips'
  },

  shareChips: function () {
    var Chips = require('../models/Chips.js');
    var ShareInput = require('./Share_Input.js');
    var chips = new Chips();
    return new ShareInput({ collection: chips });
  },

  events: {
    'click #share-send': 'onSendClick'
  },

  onSendClick: function () {

  }

});
},{"../../../architecture/classes/View.js":4,"../../templates/share_card.html":57,"../models/Chips.js":17,"./Share_Input.js":41,"underscore":"underscore"}],41:[function(require,module,exports){
'use strict';

var $ = require('jquery');

var _ = require('underscore');

var ChipsInput = require('./Chips_Input.js');

module.exports = ChipsInput.extend({

  template: require('../../templates/share_input.html')

});

},{"../../templates/share_input.html":58,"./Chips_Input.js":30,"jquery":"jquery","underscore":"underscore"}],42:[function(require,module,exports){
module.exports = "<div class=\"mdl-grid\">\n\n  <div class=\"mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-cell--middle custom-cell--center\">\n    <button class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" id=\"account-grant\">\n      grant offline access\n    </button>\n    <button class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" id=\"account-signout\">sign out</button>\n  </div>\n\n</div>\n";

},{}],43:[function(require,module,exports){
module.exports = "<div class=\"flex-container-horiz\" style=\"height: 70px; background-color: #fff; border-bottom: 1px solid #ebebeb;\">\n  <span style=\"display: inline-block; line-height: 70px; height: 70px; margin: 0 16px; color: rgba(0,0,0,.43);\">\n    <a class=\"mdl-button mdl-js-button mdl-button--icon\">\n      <img src=\"<%= getImageUrl() %>\" width=\"32px\" height=\"32px\" />\n    </a>\n  </span>\n  <span class=\"flex-grow\" style=\"display: inline-block; line-height: 70px; height: 70px; color: rgba(0,0,0,.87); text-align: center; font-size: 16px;\"><%= get('name') %></span>\n  <span style=\"display: inline-block; line-height: 70px; height: 70px; margin: 0 16px; color: rgba(0,0,0,.43);\">\n    <button class=\"mdl-button mdl-js-button mdl-button--icon\">\n      <i class=\"material-icons\">notifications</i>\n    </button>\n    <a href=\"/<\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n      <i class=\"material-icons\">arrow_backward</i>\n    </a>\n  </span>\n</div>";

},{}],44:[function(require,module,exports){
module.exports = "<div class=\"mdl-grid\">\n  <div class=\"mdl-cell mdl-cell--4-col mdl-cell--4-offset-desktop mdl-cell--1-offset-tablet mdl-cell--middle custom-cell--center\">\n    <div class=\"mdl-card mdl-shadow--2dp\">\n      <div class=\"mdl-card__actions mdl-card--border\">\n\n      </div>\n    </div>\n  </div>\n</div>";

},{}],45:[function(require,module,exports){
module.exports = "<div>\n  <div class=\"mdl-layout mdl-js-layout\">\n    <header class=\"mdl-layout__header mdl-layout__header--transparent\" style=\"display: flex !important;\"><!-- Header injected here --></header>\n    <main class=\"mdl-layout__content\"><!-- Content injected here --></main>\n    <footer><!-- Footer injected here --></footer>\n  </div>\n</div>\n";

},{}],46:[function(require,module,exports){
module.exports = "<div class=\"mdl-textfield mdl-js-textfield chips-textfield\" style=\"width: 100%; padding: 0;\">\n  <div style=\"display: flex; flex-direction: row; flex-wrap: wrap; border-bottom: 1px solid rgba(0,0,0,.12);\">\n    <div id=\"chips-list\" style=\"flex-shrink: 1;\"><!-- Chips list injected here  --></div>\n    <div style=\"flex-grow: 1; flex-shrink: 2;\">\n      <input class=\"mdl-textfield__input custom-chips-textfield__input\" type=\"text\" autocomplete=\"off\" list=\"chips-datalist\" id=\"chips-input\">\n      <datalist id=\"chips-datalist\">\n        <!-- Todo: populate the list via ajax or loaded json\n        <% Array(10).fill(\"Chip\").forEach(function (element) { %>\n          <option class=\"chips-option\" value=\"<%= element %>\">\n        <% }) %> -->\n      </datalist>\n    </div>\n  </div>\n  <!-- Todo: css for label alignment -->\n  <label class=\"mdl-textfield__label\" for=\"chips-input\"></label>\n</div>\n";

},{}],47:[function(require,module,exports){
module.exports = "<div>\n  <% each(function (chip) { %>\n    <span class=\"mdl-chip mdl-chip--deletable search-chip\">\n      <%= chip.getValue() %>\n      <button type=\"button\" class=\"mdl-chip__action chip-delete\" id=\"<%= chip.cid %>\">\n        <i class=\"material-icons\">cancel</i>\n      </button>\n    </span>\n  <% }); %>\n</div>";

},{}],48:[function(require,module,exports){
module.exports = "<div style=\"width: 100%; height: 100%;\">\n\n  <div class=\"mdl-layout mdl-js-layout\n              mdl-layout--fixed-header\">\n\n    <header class=\"mdl-layout__header\n                   mdl-color--white\n                   mdl-color-text--grey-700\"\n            style=\"box-shadow: none;\n                   border-bottom: 1px solid #e0e0e0;\">\n      \n      <div class=\"mdl-layout__header-row\" style=\"padding: 0 16px;\">\n\n        <div style=\"flex: 1; text-align: left;\">\n          <button class=\"mdl-button\n                         mdl-js-button\n                         mdl-button--icon\"\n                  id=\"close\">\n            <i class=\"material-icons\">close</i>\n          </button>\n        </div>\n\n        <div style=\"flex: 1; text-align: right;\">\n          <button class=\"mdl-button\n                         mdl-js-button\n                         mdl-button--icon\"\n                  id=\"open\">\n            <i class=\"material-icons\">open_in_new</i>\n          </button>\n        </div>\n\n      </div>\n\n    </header>\n\n    <main class=\"mdl-layout__content\n                 mdl-color-text--grey-600\"\n          style=\"padding: 16px;\">\n\n          Hello WOrld\n\n    </main>\n\n      <footer>\n\n        <div class=\"mdl-layout__header-row\" style=\"padding: 0 16px;\">\n\n          <div style=\"flex: 1; text-align: center;\">\n            <button class=\"mdl-button\n                           mdl-js-button\n                           mdl-button--colored\"\n                    id=\"save\">\n              Save\n            </button>\n          </div>\n\n          <div style=\"flex: 1; text-align: center;\">\n            <button class=\"mdl-button\n                           mdl-js-button\n                           mdl-button--colored\"\n                    id=\"send\">\n              Send\n            </button>\n          </div>\n\n        </div>\n    \n    </footer>\n\n  </div>\n\n</div>";

},{}],49:[function(require,module,exports){
module.exports = "<div class=\"mdl-grid\">\n  <div class=\"mdl-cell mdl-cell--4-col mdl-cell--4-offset-desktop mdl-cell--1-offset-tablet mdl-cell--middle custom-cell--center\">\n\n    <div class=\"mdl-card mdl-shadow--2dp\" style=\"width: 100%; padding: 48px;\">\n\n      <div class=\"mdl-card__menu\">\n        <button class=\"mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect\" id=\"login-share\">\n          <i class=\"material-icons\">share</i>\n        </button>\n      </div>\n\n      <h3 style=\"margin: 0; font-weight: 300;\">Greetings Simpl'ing</h3>\n      <p style=\"margin: 0; font-weight: 300;\">Sign in and tidy up that inbox.</p>\n\n      <div class=\"mdl-card__supporting-text\">\n        <% if ( isPending() ) {%>\n          <div class=\"mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active\"></div>\n        <% } else { %>\n          <button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" style=\"width: 100%; font-size: 16px; margin: 20px 0 10px; font-weight: 300; height: 58px; border: 1px solid rgba(76,87,102,0.1); color: #000000;\" id=\"signin\">\n            <span style=\"vertical-align: middle; float: left;\">\n              <img src=\"/images/g-logo.png\" height=\"22\" width=\"22\">\n            </span>\n            <span style=\"text-transform: capitalize; vertical-align: middle;\">Continue With Google</span>\n          </button>\n        <% } %>\n      </div>\n\n      <div class=\"mdl-card__supporting-text\">\n        <small>Curious? Behold the live <a href=\"/preview\">preview</a>.</small>\n      </div>\n\n      <div class=\"mdl-card__supporting-text\" style=\"border-top: 1px solid rgba(0,0,0,.1);\">\n        <small>Contribute to this project on <a href=\"https://github.com/danrpts/webmail_DMZ\">github</a>!</small>\n      </div>\n\n    </div>\n\n  </div>\n</div>";

},{}],50:[function(require,module,exports){
module.exports = "<div>\n  <header>\n    <h2 style=\"font-family: 'Pacifico'; font-weight: 300; color: #000000; text-align: center;\">Simpl.eMail</h2>\n  </header>\n  <main><!-- Content injected here --></main>\n</div>";

},{}],51:[function(require,module,exports){
module.exports = "<div style=\"width: 100%; height: 100%;\">\n\n  <div class=\"mdl-layout mdl-js-layout\n              mdl-layout--fixed-header\">\n\n    <header class=\"mdl-layout__header\n                   mdl-color--white\n                   mdl-color-text--grey-700\"\n            style=\"box-shadow: none;\n                   border-bottom: 1px solid #e0e0e0;\">\n      \n      <div class=\"mdl-layout__header-row\" style=\"padding: 0 16px;\">\n\n        <div style=\"flex: 1; text-align: left;\">\n          <button class=\"mdl-button\n                         mdl-js-button\n                         mdl-button--icon\"\n                  id=\"close\">\n            <i class=\"material-icons\">close</i>\n          </button>\n        </div>\n\n        <div style=\"flex: 1; text-align: right;\">\n          <button class=\"mdl-button\n                         mdl-js-button\n                         mdl-button--icon\"\n                  id=\"open\">\n            <i class=\"material-icons\">open_in_new</i>\n          </button>\n        </div>\n\n      </div>\n\n    </header>\n\n    <main class=\"mdl-layout__content\n                 mdl-color-text--grey-600\"\n          style=\"padding: 16px;\">\n\n      <% if ( isPending() ) { %>\n          \n        Loading message...\n        \n      <% } else { %>\n\n        <div class=\"mdl-card mdl-shadow--2dp\" style=\"width: 100%;\">\n\n          <h5 class=\"mdl-card__title\" style=\"margin: 0px; font-weight: 200; padding: 16px 16px 0 16px;\">\n            <div class=\"truncate\">\n              <span class=\"ellipsis\"><%= getSubject() %></span>\n              <span style=\"text-align: right; font-size: 14px; font-weight: 400; letter-spacing: 0; line-height: 24px; height: 24px; color: rgba(0,0,0,.54); padding: 0;\">\n                <button class=\"mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect\">\n                  <i class=\"material-icons\">star_outline</i>\n                </button>\n              </span>\n            </div>\n          </h5>\n\n          <div class=\"mdl-card__title\" style=\"padding: 0 16px;\">\n            <li class=\"mdl-list__item\" style=\"width: 100%; color: rgba(0,0,0,.54); font-size: 14px; font-weight: 400; letter-spacing: 0; padding: 0px;\">\n              <span class=\"mdl-list__item-primary-content\">\n                \n                <div class=\"truncate\">\n                  <span class=\"ellipsis\">\n                    <% if ( isUnread() ) { %>\n                      <i class=\"fa fa-circle\" style=\"color: #03A9F4;\"></i>\n                    <% } else { %>\n                      <i class=\"fa fa-circle-thin\" style=\"color: #03A9F4;\"></i>\n                    <% } %>\n                    <span style=\"text-decoration: underline; padding-left: 12px;\"><%= getFrom()[0] %></span>\n                      &nbsp;to&nbsp;\n                    <span style=\"text-decoration: underline;\"><%= getTo() %></span>\n                  </span>\n                  <span style=\"text-align: right; font-size: 14px; font-weight: 400; letter-spacing: 0; line-height: 24px; height: 24px; color: rgba(0,0,0,.54); padding: 0;\">\n                    <% if ( hasAttachment() ) { %>\n                      <i class=\"fa fa-paperclip\">&nbsp;</i>\n                    <% } else { %>\n                      <i class=\"fa fa-fw\">&nbsp;</i>\n                    <% } %>\n                    <%= getHumanDate() %>\n                  </span>\n                </div>\n\n              </span>\n\n            </li>\n          </div>\n\n          <div class=\"mdl-card__supporting-text\" style=\"width: initial;\"><iframe srcdoc=\"<%- getBody() %>\" width=\"100%\"></iframe></div>\n        \n        </div>\n\n      <% } %>\n    \n    </main>\n\n      <footer>\n\n        <div class=\"mdl-layout__header-row\" style=\"padding: 0 16px;\">\n\n          <div style=\"flex: 1; text-align: center;\">\n            <button class=\"mdl-button\n                           mdl-js-button\n                           mdl-button--colored\"\n                    id=\"trash\">\n              Trash\n            </button>\n          </div>\n\n          <div style=\"flex: 1; text-align: center;\">\n            <button class=\"mdl-button\n                           mdl-js-button\n                           mdl-button--colored\"\n                    id=\"snooze\">\n              Snooze\n            </button>\n          </div>\n\n          <div style=\"flex: 1; text-align: center;\">\n            <button class=\"mdl-button\n                           mdl-js-button\n                           mdl-button--colored\"\n                    id=\"forward\">\n              Forward\n            </button>\n          </div>\n\n          <div style=\"flex: 1; text-align: center;\">\n            <button class=\"mdl-button\n                           mdl-js-button\n                           mdl-button--colored\"\n                    id=\"reply\">\n              Reply\n            </button>\n          </div>\n\n        </div>\n\n      </footer>\n\n  </div>\n\n</div>";

},{}],52:[function(require,module,exports){
module.exports = "<div>\n\n  <% if ( isPending() ) { %>\n\n    <div class=\"mdl-progress mdl-js-progress mdl-progress__indeterminate custom-progress__indeterminate\"></div>\n\n  <% } %>\n\n  <% if ( isEmpty() ) { %>\n\n    <span>(No Messages)</span>\n\n  <% } else { %>\n      \n    <ul class=\"mdl-list mdl-color--white\">\n\n       <% each(function (message) { %>\n\n        <li class=\"mdl-list__item mdl-list__item--three-line list-border\">\n\n          <span class=\"mdl-list__item-primary-content\" style=\"height: 80px;\">\n\n            <a href=\"/messages/<%= message.id %>\" class=\"clear\">\n              <div class=\"truncate\">\n                <span class=\"ellipsis\" style=\"font-size: 14px; font-weight: 400; letter-spacing: 0; line-height: 28px; height: 28px; color: rgba(0,0,0,.54); display: block;\">\n                  <span style=\"padding-left: 6px; <% message.isUnread() && print('font-weight: 500; color: rgba(0,0,0,.87);') %>\">\n                    <%= message.getFrom()[0] %>\n                  </span>\n                </span>\n                <span style=\"text-align: right; font-size: 14px; font-weight: 400; letter-spacing: 0; line-height: 28px; height: 28px; color: rgba(0,0,0,.54);\">\n                  <% if ( message.hasAttachment() ) { %>\n                    <i class=\"fa fa-paperclip\">&nbsp;</i>\n                  <% } else { %>\n                    <i class=\"fa fa-fw\">&nbsp;</i>\n                  <% } %>\n                  <%= message.getTimeAgo() %>\n                </span>\n              </div>\n              <div class=\"truncate\">\n                <span class=\"ellipsis\" style=\"font-size: 14px; font-weight: 400; letter-spacing: 0; line-height: 24px; height: 24px; color: rgba(0,0,0,.54); display: block;\">\n                  <span style=\"padding-left: 6px;\">\n                  <%= message.getSubject() %>\n                  </span>\n                </span>\n              </div>\n              <div class=\"truncate\">\n                <span class=\"ellipsis\" style=\"font-size: 14px; font-weight: 400; letter-spacing: 0; line-height: 24px; height: 24px; color: rgba(0,0,0,.54); display: block;\">\n                  <span style=\"padding-left: 6px;\">\n                    <%= message.getSnippet() %>\n                  </span>\n                </span>\n              </div>\n            </a>\n          </span>\n        </li>\n\n       <% }); %>\n\n    </ul>\n\n    <footer class=\"mdl-color--white\" style=\"height: 68px; width: 100%;\">\n      <% if ( hasMore() ) { %>\n        <div style=\"padding: 16px 48px; text-align: center;\">\n          <button class=\"mdl-button mdl-js-button mdl-button--accent\" id=\"more\">\n            Load More\n          </button>\n        </div>\n      <% } %>\n    </footer>\n\n  <% } %>\n</div>";

},{}],53:[function(require,module,exports){
module.exports = "<div style=\"height: 100%; width: 100%;\">\n\n  <div class=\"mdl-layout mdl-js-layout\n              mdl-layout--fixed-drawer\">\n    \n    <div class=\"mdl-layout__drawer\" data-region=\"drawer\">\n      \n      <!-- Nav Sheet injected here  -->\n\n    </div>\n\n    <!-- Need 100% height here for scrolling on the injected view to work -->\n\n    <div class=\"mdl-layout__content\" style=\"height: 100%;\">\n\n      <div class=\"flex-container-horiz\">\n        \n        <div data-region=\"content\" style=\"position: relative; flex: 1; min-width: 400px; height: 100%;\">\n\n          <!-- Compose FAB only displayed on small screens -->\n\n          <button class=\"mdl-button mdl-js-button \n                         mdl-button--fab mdl-button--fab \n                         mdl-button--colored \n                         mdl-color-text--white \n                         mdl-layout--small-screen-only\"\n                  style=\"position: absolute;\n                         right: 0;\n                         bottom: 0;\n                         z-index: 999;\n                         margin: 23px;\" \n                  id=\"compose\">\n\n            <i class=\"material-icons\">create</i>\n          \n          </button>\n\n          <!-- Message Sheet or Messages List injected here -->\n        \n        </div>\n\n          <div class=\"resizable\" style=\"display: none; min-width: 400px; width: 400px; height: 100%;\">\n        \n            <div style=\" height: 100%; position: relative; box-sizing: border-box; border-left: 1px solid #e0e0e0;\">\n\n              <span class=\"ui-resizable-handle ui-resizable-w\"></span>\n            \n              <aside data-region=\"secondary\" style=\"width: 100%; height: 100%;\">\n              \n                <!-- Message injected here -->\n              \n              </aside>\n            \n            </div>\n          \n          </div>\n\n      </div>\n\n    </div>\n\n  </div>\n\n</div>\n";

},{}],54:[function(require,module,exports){
module.exports = "\n<!-- Need 100% height here for scrolling to work -->\n<div style=\"height: 100%;\">\n\n  <div class=\"mdl-layout mdl-js-layout\n              mdl-layout--fixed-header\">\n\n    <header class=\"mdl-layout__header\n                   mdl-color--white\n                   mdl-color-text--grey-700\"\n            style=\"box-shadow: none;\n                   border-bottom: 1px solid #e0e0e0;\">\n\n      <div class=\"mdl-layout__header-row\">\n\n        <div class=\"mdl-layout-spacer\"></div>\n\n        <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--expandable\n                    mdl-textfield--floating-label mdl-textfield--align-right\">\n\n          <label class=\"mdl-button mdl-js-button mdl-button--icon\"\n                 for=\"search\">\n\n            <i class=\"material-icons\">search</i>\n          \n          </label>\n          \n          <div class=\"mdl-textfield__expandable-holder\">\n            <input class=\"mdl-textfield__input\" type=\"text\" name=\"query\"\n                   id=\"search\">\n                   \n          </div>\n        \n        </div>\n    \n      </div>\n      \n    </header>\n\n    <div class=\"mdl-layout__content\n                mdl-color-text--grey-600\"\n         data-region=\"messages-list\">\n\n        <!-- Messages list inejected here -->\n\n    </div>\n\n  </div>\n\n</div>\n";

},{}],55:[function(require,module,exports){
module.exports = "<div class=\"mdl-layout mdl-js-layout\n            mdl-layout--fixed-header\">\n\n  <header class=\"mdl-layout__header\n                 mdl-color--white\n                 mdl-color-text--grey-700\"\n          style=\"box-shadow: none;\n                 border-bottom: 1px solid #e0e0e0;\">\n\n    <div class=\"mdl-layout__header-row\" style=\"padding: 0 32px;\">\n\n      <div style=\"width: 100%;\">\n\n\n          <button class=\"mdl-button mdl-js-button mdl-button--icon\" id=\"avatar\">\n            <img src=\"<%= getImageUrl() %>\" width=\"32px\" height=\"32px\" />\n          </button>\n\n          <span>Hello <%= getFirstName() %></span>\n\n      </div>\n\n    </div>\n\n  </header>\n\n  <main class=\"mdl-layout__content\n               mdl-color-text--grey-600\"\n        style=\"padding: 16px 32px;\">\n\n      <div style=\"padding: 16px 0;\">\n        <button class=\"mdl-button mdl-js-button\n                       mdl-button--raised mdl-button--accent\"\n                style=\"width: 100%;\"\n                id=\"compose\">\n          Compose\n        </button>\n      </div>\n\n      <div class=\"labels\">\n        <span style=\"display: block;\">Mailboxes</span>\n        <span class=\"label labels__link\">Inbox</span>\n        <span class=\"label labels__link\">Starred</span>\n        <span class=\"label labels__link\">Sent</span>\n        <span class=\"label labels__link\">Drafts</span>\n        <span class=\"label labels__link\">Trash</span>\n      </div>\n\n      <div class=\"labels\">\n        <span style=\"display: block;\">Labels</span>\n        <span class=\"labels__link\">\n          <i class=\"fa fa-circle-thin mdl-color-text--orange-300\" aria-hidden=\"true\"></i>&nbsp;Snoozed\n        </span>\n        <span class=\"labels__link\">\n          <i class=\"fa fa-circle-thin mdl-color-text--green-300\" aria-hidden=\"true\"></i>&nbsp;Forwarded\n        </span>\n        <span class=\"labels__link\">\n          <i class=\"fa fa-circle-thin mdl-color-text--blue-300\" aria-hidden=\"true\"></i>&nbsp;Replied\n        </span>\n        <span class=\"labels__link\">\n          <i class=\"fa fa-circle-thin mdl-color-text--purple-300\" aria-hidden=\"true\"></i>&nbsp;Archived\n        </span>\n      </div>\n\n  </main>\n\n  <footer class=\"mdl-color-text--grey-600\"\n          style=\"padding: 4px;\">\n    <button class=\"mdl-button mdl-js-button mdl-button--icon\" style=\"float: right;\">\n      <i class=\"material-icons\" style=\"font-size: 14px;\">settings</i>\n    </button>\n  </footer>\n\n</div>";

},{}],56:[function(require,module,exports){
module.exports = "<div class=\"mdl-textfield mdl-js-textfield mdl-textfield--expandable\n            mdl-textfield--floating-label mdl-textfield--align-right\">\n  <label class=\"mdl-button mdl-js-button mdl-button--icon\"\n         for=\"search\">\n    <i class=\"material-icons\">search</i>\n  </label>\n  <div class=\"mdl-textfield__expandable-holder\">\n    <input class=\"mdl-textfield__input\" type=\"text\" name=\"query\"\n           id=\"search\">\n    <!-- <div id=\"chip-list\" style=\"flex-shrink: 1;\"></div> -->\n  </div>\n</div>\n";

},{}],57:[function(require,module,exports){
module.exports = "<div class=\"mdl-grid\">\n  <div class=\"mdl-cell mdl-cell--4-col mdl-cell--4-offset-desktop mdl-cell--1-offset-tablet mdl-cell--middle custom-cell--center\">\n\n    <div class=\"mdl-card mdl-shadow--2dp\" style=\"width: 100%; padding: 48px;\">\n\n      <div class=\"mdl-card__menu\">\n        <button class=\"mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect\" id=\"share-back\">\n          <i class=\"material-icons\">arrow_backward</i>\n        </button>\n      </div>\n\n      <h3 style=\"margin: 0; font-weight: 300;\">Tell your friends</h3>\n      <p style=\"margin: 0; font-weight: 300;\">A messy inbox is futile.</p>\n\n      <div class=\"mdl-card__supporting-text\" style=\"width: 100%\">\n        <div  style=\"width: 100%; font-size: 16px; margin: 20px 0 10px; font-weight: 300; height: 58px;\">\n          <button class=\"mdl-button mdl-js-button mdl-button--icon\" style=\"background-color: #55acee; color: #ffffff; margin: 0 12px; height: 58px; width: 58px\">\n           <i class=\"fa fa-twitter\"></i>\n          </button>\n          <button class=\"mdl-button mdl-js-button mdl-button--icon\" style=\"background-color: #405499; color: #ffffff; margin: 0 12px; height: 58px; width: 58px\">\n            <i class=\"fa fa-facebook\"></i>\n          </button>\n          <button class=\"mdl-button mdl-js-button mdl-button--icon\" style=\"background-color: #c13c31; color: #ffffff; margin: 0 12px; height: 58px; width: 58px\">\n            <i class=\"fa fa-google-plus\"></i>\n          </button>\n        </div>\n      </div>\n\n\n      <div class=\"mdl-card__supporting-text\" style=\"width: 100%\">\n        <small>Still curious? Behold the live <a href=\"/preview\">preview</a>.</small>\n      </div>\n        \n      <div class=\"mdl-card__supporting-text\" style=\"width: 100%; border-top: 1px solid rgba(0,0,0,.1);\">\n        <small>View this project on <a href=\"https://github.com/danrpts/webmail_DMZ\">github</a>!</small>\n      </div>\n\n    </div>\n\n  </div>\n\n</div>\n";

},{}],58:[function(require,module,exports){
module.exports = "<div class=\"mdl-textfield mdl-js-textfield\" style=\"width: 100%\">\n  <input class=\"mdl-textfield__input\" type=\"text\" id=\"share\">\n  <label class=\"mdl-textfield__label\" for=\"share\">Email Addresses</label>\n</div>";

},{}]},{},[15]);
