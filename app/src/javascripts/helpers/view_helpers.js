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
