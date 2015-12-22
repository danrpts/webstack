var $ = require('jquery');
var _ = require('underscore');
var closure = require('./presenter_helpers.js');

module.exports = {

  repeat: function (View) {
    var $fragment = $(document.createDocumentFragment());
    this.collection.each(function (model) {
      new View({model: model}).render().$el.appendTo($fragment);
    });
    return $fragment;
  },

  compile: function () {

      // Hoist 'em
      var entity, template, templater, compiled;

      // Reference model, collection or nonsuch
      entity = (!!this.model) ? this.model : (!!this.collection) ? this.collection : false;

      // When it the intitial render, build the presenter
      (!this.rendered) && (!!entity) && (this.presenter = closure.call(entity));

      // Allow overriding of underscore's templater
      templater = _.isFunction(this.templater) ? this.templater : _.template;

      // First run the markup through the templater
      template = templater(this.template);

      // Then run the presenter through the templater
      compiled = (!!this.presenter) ? template(this.presenter) : template();

      // Jquery this sucker
      this.$compiled = $(compiled);

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
