(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('../helpers/model_helpers.js');

var Collection = function (models, options) {
  Backbone.Collection.apply(this, arguments);
}

Collection.prototype = Object.create(Backbone.Collection.prototype);

_.extend(Collection.prototype, helpers);

Collection.extend = Backbone.Collection.extend;

module.exports = Collection;

},{"../helpers/model_helpers.js":5,"backbone":"backbone","underscore":"underscore"}],2:[function(require,module,exports){
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
},{"../helpers/model_helpers.js":5,"backbone":"backbone","underscore":"underscore"}],3:[function(require,module,exports){
var Backbone = require('backbone'); // Event system
var layout = require('../helpers/layout_helpers.js');
var list = require('../models/tasks_model.js');
var ListView = require('../views/tasks_ListView.js');
var CardView = require('../views/tasks_CardView.js');

// Router API
var API = {

  list: function () {

    // Create its preliminary view
    var view = new ListView({collection: list});

    // Then swap the view into the default region
    layout.swap(view, {

      // And show the loader if necessary
      loading: list.promise()

    });

  },

  card: function (itemid) {

    // Check if model is cached
    var item = list.get(itemid);

    // If not build it
    if (!item) item = list.add({id: itemid});

    // Now create its preliminary view
    var view = new CardView({model: item});

    // Then swap the view into the default region
    layout.swap(view, {

      // And show loader if necessary
      loading: item.promise()

    });

  }

}

var Router = Backbone.Router.extend({

  routes: {
    '': API.list,
    'tasks/:id': API.card
  },

  initialize: function () {
    this.listenTo(Backbone, 'router:goto', this.goto);
  },

  goto: function (fragment) {
    this.navigate(fragment, {trigger: true});
  }

});

new Router();

},{"../helpers/layout_helpers.js":4,"../models/tasks_model.js":7,"../views/tasks_CardView.js":10,"../views/tasks_ListView.js":12,"backbone":"backbone"}],4:[function(require,module,exports){
var $ = require('jquery');
var _ = require('underscore');

// Private
var regions = {

  content: $('[data-js-region="content"')

}

// Public
module.exports = {

  swap: function (view, options) {

    options = options || {};

    _.defaults(options, {
      loading: false,
      region: 'content'
    });

    var region = regions[options.region];

    if (!!region.view) {
      region.view.remove();
    }

    region.view = view;
    
    if (!!options.loading) {
      console.log('Loading...');
      options.loading.done(function () {
        //setTimeout(function () {
          console.log('Resoloved!');
          region.html(view.render())
        //}, 1000);
      });
    }

    else {
      region.html(view.render());
    }

  }

}

},{"jquery":"jquery","underscore":"underscore"}],5:[function(require,module,exports){
module.exports = {
  
  promise: function(options) {
    var promise;
    options = options || {};
    promise = this.fetch(options).promise();
    return promise;
  }
  
}

},{}],6:[function(require,module,exports){
'use strict';
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');

$(function() {

  require('./controllers/tasks_controller.js');

  // TODO: {pushState: true} requires thought out server mods
  Backbone.history.start(); 

});

},{"./controllers/tasks_controller.js":3,"backbone":"backbone","backbone.localstorage":"backbone.localstorage","jquery":"jquery"}],7:[function(require,module,exports){
var _ = require('underscore');
var Backbone = require('backbone');
var Model = require('../classes/Model.js');
var Collection = require('../classes/Collection.js');

// Private data representations
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

// Public
module.exports =  new ListCollection();

},{"../classes/Collection.js":1,"../classes/Model.js":2,"backbone":"backbone","underscore":"underscore"}],8:[function(require,module,exports){
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

},{"underscore":"underscore"}],9:[function(require,module,exports){
var _ = require('underscore');

var helpers = {

  totalComplete: function () {
    return _.where(this, {'complete': true}).length;
  }

}

module.exports = function (resource) {
  return _.extend(resource.toJSON(), helpers);
}

},{"underscore":"underscore"}],10:[function(require,module,exports){
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var itemPresenter = require('../presenters/tasks_itemPresenter.js');

var CardView = Backbone.View.extend({

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

  template: _.template(require('../../templates/tasks_CardTemplate.html')),

  toggle: function () {
    this.model.toggle();
  },

  back: function () {
    Backbone.trigger('router:goto', '');
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
      Backbone.trigger('router:goto', '');
    });  
  },

  updateTitle: function () {
    this.model.save({'title': this.$('#title-input').val().trim()}, {wait: true});
  },

  updateDetails: function () {
    this.model.save({'details': this.$('#details-input').val().trim()}, {wait: true});
  },

  // Bugged
  render: function () {

    // Build template
    var helpers = itemPresenter(this.model);
    var $compiled = $(this.template(helpers));

    // When it's the initial render
    if (!this.rendered) {
      this.setElement($compiled);
      this.rendered = true;
      console.log('Initial render card.');
    }

    // When it's a re-render
    else {
      this.$el.html($compiled.html());
      console.log('Re-render card.');
    }
    
    if (helpers.isComplete()) {
      this.$('#toggle').toggleClass('mdl-color--green');
    }

    // MDL
    componentHandler.upgradeElements(this.el);

    return this.$el;
  }
});

module.exports = CardView;

},{"../../templates/tasks_CardTemplate.html":13,"../presenters/tasks_itemPresenter.js":8,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],11:[function(require,module,exports){
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var itemPresenter = require('../presenters/tasks_itemPresenter.js');

var ItemView = Backbone.View.extend({

  events: {
    'mouseup #toggle': 'toggle',
    'dblclick #title': 'open',
    'mouseup #delete': 'delete'
  },

  template: _.template(require('../../templates/tasks_ItemTemplate.html')),

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  toggle: function () {
    this.model.toggle();
  },

  open: function () {
    Backbone.trigger('router:goto', 'tasks/' + this.model.id);
  },

  delete: function () {
    this.model.destroy();
    var that = this;
    this.$el.fadeOut('slow', function () {
      that.remove();
    });
  },

  render: function () {

    var helpers = itemPresenter(this.model);
    var $compiled = $(this.template(helpers));

    // When it's the initial render
    if (!this.rendered) {
      this.setElement($compiled);
      this.rendered = true;
    }

    // When it's a re-render
    else {
      this.$el.html($compiled.html());
    }
    
    componentHandler.upgradeElements(this.el);
    if (helpers.isComplete()) {
      this.$('#title').addClass('complete');
      this.el.querySelector('#toggle').MaterialCheckbox.check();
    }
    return this.$el;
  }
});

module.exports = ItemView;

},{"../../templates/tasks_ItemTemplate.html":14,"../presenters/tasks_itemPresenter.js":8,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],12:[function(require,module,exports){
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var ItemView = require('./tasks_ItemView.js');
var listPresenter = require('../presenters/tasks_listPresenter.js');

var ListView = Backbone.View.extend({

  template: _.template(require('../../templates/tasks_ListTemplate.html')),

  events: {
    'keyup #input-title': 'onEnter'
  },

  initialize: function () {
    this.listenTo(this.collection, 'add', this.render);
  },

  onEnter: function (event) {
    if (event.which === 13) {
      var input = this.$('#input-title');
      this.collection.create({'title': input.val().trim()});
      input.val('');
    }
  },

  // Bug causing render per model due to add event on collection fetch
  render: function () {

    // Build template
    var helpers = listPresenter(this.collection);
    var $compiled = $(this.template(helpers));

    // When it's the initial render
    if (!this.rendered) {
      this.setElement($compiled);
      this.rendered = true;
      console.log('Initial render list.');
    }

    // When it's a re-render
    else {
      this.$el.html($compiled.html());
      console.log('Re-render list.');
    }

    var $list = this.$('ul');
    var $listfragment = $(document.createDocumentFragment());
    this.collection.each(function (itemModel, index) {
      new ItemView({model: itemModel}).render().appendTo($listfragment);
    });
    $listfragment.appendTo($list);

    // MDL
    componentHandler.upgradeElements(this.el);

    // Returning $el instead
    return this.$el;
  }
});

module.exports = ListView;

},{"../../templates/tasks_ListTemplate.html":15,"../presenters/tasks_listPresenter.js":9,"./tasks_ItemView.js":11,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],13:[function(require,module,exports){
module.exports = "<div style=\"width: 330px; margin:0 auto; padding-top: 3%\">\n  <div class=\"mdl-card mdl-shadow--2dp custom-card\">\n\n    <button id=\"toggle\" class=\"mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored\">\n      <i class=\"material-icons\">check</i>\n    </button>\n\n    <div class=\"mdl-card__title custom-card__title\">\n      <div class=\"mdl-card__subtitle-text\">\n        <div class=\"mdl-textfield mdl-js-textfield\">\n          <input id=\"title-input\" class=\"mdl-textfield__input\" type=\"text\" maxlength=\"23\" value=\"<%- title %>\"/>\n          <label class=\"mdl-textfield__label\" for=\"title-input\" id=\"title-label\"><%- title %></label>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"mdl-card__supporting-text custom-card__supporting-text\">\n      <div class=\"mdl-card__subtitle-text\">\n        <div class=\"mdl-textfield mdl-js-textfield\">\n          <textarea id=\"details-input\" class=\"mdl-textfield__input\" type=\"text\" rows=\"1\"><% hasDetails() && print(details) %></textarea>\n          <label class=\"mdl-textfield__label\" for=\"details-input\" id=\"details-label\"><% !hasDetails() && print(\"Add details...\") %></label>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"mdl-card__actions mdl-card--border\">\n      <button id=\"back\" class=\"mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect\">\n        <i class=\"material-icons grey\">arrow_back</i>\n      </button>\n      <button id=\"delete\" class=\"mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect\">\n        <i class=\"material-icons grey\">delete</i>\n      </button>\n    </div>\n\n  </div>\n</div>\n";

},{}],14:[function(require,module,exports){
module.exports = "<li>\n  <div class=\"mdl-card mdl-shadow--2dp custom-card-item\">\n\n      <div class=\"flexbox\">\n        <div class=\"raw48x64\">\n          <div class=\"checkbox\">\n            <label id=\"toggle\" class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\">\n              <input type=\"checkbox\" class=\"mdl-checkbox__input\" />\n            </label>\n          </div>\n        </div>\n\n        <div class=\"flexible\">\n          <div class=\"text\">\n            <label id=\"title\" class=\"mdl-checkbox__label\"><%- title %></label>\n          </div>\n        </div>\n\n        <div class=\"raw64\">\n          <div class=\"icon\">\n            <button id=\"delete\" class=\"mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect\">\n              <i class=\"material-icons grey\">delete</i>\n            </button>\n          </div>\n        </div>\n      </div>\n\n  </div>\n</li>\n";

},{}],15:[function(require,module,exports){
module.exports = "<div style=\"width: 330px; margin:0 auto; padding-top: 3%\">\n  <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label custom-textfield\">\n    <input class=\"mdl-textfield__input\" type=\"text\" id=\"input-title\" maxlength=\"23\">\n    <label class=\"mdl-textfield__label\" for=\"input-title\">What needs to be done?</label>\n  </div>\n  <ul></ul>\n</div>\n\n";

},{}]},{},[6]);
