var $ = require('jquery');
var _ = require('underscore');

module.exports = {

  compile: function () {

      var resource, template, templater, presenter, compiled;

      // Reference model, collection or nonsuch
      resource = (!!this.model) ? this.model : (!!this.collection) ? this.collection : false;

      // Allow overriding of underscore's templater
      templater = _.isFunction(this.templater) ? this.templater : _.template;

      // First run the markup through the templater
      template = templater(this.template);

      // Next mixin the presenter's helpers, return just as data or nothing at all
      presenter = _.isFunction(this.presenter) && (!!resource) ? this.presenter(resource) : (!!resource) ? resource.toJSON() : false;

      // Then run the data through the templater
      compiled = (!!presenter) ? template(presenter) : template();

      // Jquery this sucker
      this.$compiled = $(compiled);

      // Store the helpers on the object for later use
      (!!presenter) && (this.helpers = presenter);

      // Chaining
      return this;

    },

    render: function (callback) {

      // Compile the $el
      this.compile();

      // When it's the initial render
      if (!this.rendered) {
        this.setElement(this.$compiled);
        this.rendered = true;
      }

      // When it's a re-render
      else this.$el.html(this.$compiled.html());

      // Allow injection of async code
      _.isFunction(callback) && callback.call(this);

      // Material Design Lite (MDL)
      componentHandler.upgradeElements(this.el);

      // Force chaining on this
      return this;
      
    }

}
