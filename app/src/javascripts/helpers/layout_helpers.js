var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

// Private. TODO: move this to config
var regions = {
  header: $('[data-region="header"]'),
  content: $('[data-region="content"]')
}

// Public
module.exports = {

  swap: function (options) {

    options = options || {};

    _.defaults(options, {
      debug: undefined,
      delay: 0,
      loading: false,
      region: 'content',
      view: this
    });

    var region = regions[options.region];

    if (!!region.view) {
      region.view.off();
      (!!region.view.model) && region.view.model.off();
      region.view.remove();
      delete region.view;
    }

    region.view = options.view;
    
    // If loading screen desired
    if (!!options.loading) {

      // Notify when promise has started
      (options.debug) && console.log('Loading...');

      // TODO
      var loader = $('<div class="app"><div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active loader"></div></div>');
      componentHandler.upgradeElements(loader[0]);
      loader.appendTo(region);

      // Promise callbacks
      options.loading.done(function () {

        // Allow artificial delays for perceived performance
        setTimeout(function () {

          // Notify when the promise has resolved
          (options.debug) && console.log('Resoloved!');

          // If view has not changed since the promise was made, render it
          (region.view === options.view) && region.html(options.view.render().$el);

        }, Math.round(options.delay));

      });

    }

    // Else just render it
    else {
      region.html(options.view.render().$el);
    }

  }

}
