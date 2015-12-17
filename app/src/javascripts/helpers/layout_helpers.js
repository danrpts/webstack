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
      (options.debug) && console.log('Loading...');
      region.html('<div style="width: 330px; margin:0 50%; padding-top: 15%">  <div class="preloader-wrapper small active"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div>');
      options.loading.done(function () {
        setTimeout(function () {


          (options.debug) && console.log('Resoloved!'); 

          // If view has not changed since the promise was made, render it
          (region.view === view) && region.html(view.render());
        }, Math.round(options.delay));
      });
    }

    else {
      region.html(view.render());
    }

  }

}
