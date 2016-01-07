var $ = require('jquery');
var _ = require('underscore');
var closure = require('./presenter_helpers.js');

module.exports = {

  repeat: function (Controller) {
    var $fragment = $(document.createDocumentFragment());
    this.collection.each(function (model) {
      new Controller({model: model}).render().$el.appendTo($fragment);
    });
    return $fragment;
  },

  compile: function () {

      // Hoist 'em
      var entity, template, templater, compiled;

      // Reference the model or collection or nonsuch
      entity = this.model || this.collection || false;

      // When it's the intitial render, build the presenter
      (!this._rendered) && (!!entity) && (this.presenter = closure.call(entity));

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
      if (!this._rendered) {

        // Place in DOM
        this.setElement(this.$compiled);

        // Set render state
        this._rendered = true;
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
