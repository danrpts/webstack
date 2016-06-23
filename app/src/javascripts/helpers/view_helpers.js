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
