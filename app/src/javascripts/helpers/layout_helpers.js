var $ = require('jquery');
var _ = require('underscore');

// Private
var regions = {

  content: $('[data-js-region="content"')

}

// Public
module.exports = {

  swap: function (view, options) {

    options = options || {};

    _.defaults(options, {
      loading: false,
      region: 'content'
    });

    var region = regions[options.region];

    if (!!region.view) {
      region.view.remove();
    }

    region.view = view;
    
    if (!!options.loading) {
      console.log('Loading...');
      options.loading.done(function () {
        //setTimeout(function () {
          console.log('Resoloved!');
          region.html(view.render())
        //}, 1000);
      });
    }

    else {
      region.html(view.render());
    }

  }

}
