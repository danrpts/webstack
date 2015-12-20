var $ = require('jquery');
var _ = require('underscore');

// Private
var regions = {
  header: $('[data-js-region="header"'),
  content: $('[data-js-region="content"')

}

// Public
module.exports = {

  swap: function (view, options) {

    options = options || {};

    _.defaults(options, {
      loading: false,
      delay: 0,
      region: 'content'
    });

    var region = regions[options.region];

    if (!!region.view) {
      region.view.off();
      (!!region.view.model) && region.view.model.off();
      region.view.remove();
      delete region.view.$el;
      delete region.view.el;
    }

    region.view = view;
    
    if (!!options.loading) {

      // Notify when promise has started
      (options.debug) && console.log('Loading...');

      // TODO
      var loader = '<div class="loader">Loading...</div>';
      region.html(loader);
      
      // Promise callbacks
      options.loading.done(function () {

        // Allow artificial delays for perceived performance
        setTimeout(function () {

          // Notify when the promise has resolved
          (options.debug) && console.log('Resoloved!'); 

          // If view has not changed since the promise was made, render it
          (region.view === view) && region.html(view.render().$el);

        }, Math.round(options.delay));

      });

    }

    else {
      region.html(view.render().$el);
    }

  }

}
