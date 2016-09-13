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