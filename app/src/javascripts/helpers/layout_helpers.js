
// Import basic dependencies
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var $root = $('body');

module.exports = {

  swap: function (options) {

    var $region;

    options = options || {};

    // Set the default options
    _.defaults(options, {
      debug: undefined,
      delay: 0,
      loading: false,
      region: 'layout',
      controller: this
    });

    // Reference the region to manipulate
    $region = $root.find('[' + this.attribute + '=' + options.region + ']');

    if (!!$region.controller) {

      // Turn of events
      $region.controller.off();
      
      // Do not call model.off since we may have other controllers using the same model
      // (!!$region.controller.model) && $region.controller.model.off();
      
      // Remove it from DOM
      $region.controller.remove();

      // Delete it from memory
      delete region.controller;

    }

    $region.controller = options.controller;
    
    // If loading screen desired
    if (!!options.loading) {

      // Notify when promise has started
      (options.debug) && console.log('Loading...');

      // TODO: move this into proper template
      var loader = $('<div class="app"><div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active loader"></div></div>');
      componentHandler.upgradeElements(loader[0]);
      loader.appendTo($region);

      // Promise callbacks
      options.loading.done(function () {

        // Allow artificial delays for perceived performance
        setTimeout(function () {

          // Notify when the promise has resolved
          (options.debug) && console.log('Resoloved!');

          // If regions controller has not changed since the promise was made, render it's view
          ($region.controller === options.controller) && $region.html(options.controller.render().$el);

        }, Math.round(options.delay));

      });

    }

    // Otherwise
    else {

      // Just render it
      $region.html(options.controller.render().$el);
    }


    console.log($region);

    return this;

  },

  // Overwrite defualt compile function
  compile: function () {

    // First jQuery this sucker
    this.$compiled = $(this.template);

    // Find all the regions and store as the jQuery object
    //this.$regions = this.$compiled.find('[' + this.attribute + ']');

    // Chaining
    return this;

  }

}
