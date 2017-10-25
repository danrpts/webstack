'use strict';

var $ = require('jquery');

var _ = require('underscore');

var backbone = require('backbone');

module.exports = {

  remove: function () {

    var options = _.last(arguments);

    if (_.isFunction(this.preremove)) this.preremove(options);

    this.trigger('pre:remove', options);

    this.rendered = false;

    // Detach from the DOM
    backbone.View.prototype.remove.apply(this, arguments);
    
    // Call the postremove function after current call stack
    if (_.isFunction(this.postremove)) _.defer(_.bind(this.postremove, this), options);
    
    this.trigger('post:remove', options);

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

    if (_.isFunction(this.prerender)) this.prerender(options);

    this.trigger('pre:render', options);
      
    this.compile(options);

    // Call the postrender function after current call stack
    if (_.isFunction(this.postrender)) _.defer(_.bind(this.postrender, this), options);
    
    this.trigger('post:render', options);
    
    return this;
  
  }

}
