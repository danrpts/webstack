'use strict';

var $ = require('jquery');
var backbone = require('backbone');
backbone.LocalStorage = require('backbone.localstorage');
var Router = require('./routers/');

$(function() {

  window.transition = new Router();

  $(document).on('click', '[href^="/"]', function (event) {

    var href = $(event.currentTarget).attr('href')

    !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey
      && event.preventDefault();

    var fragment = href.replace(/^\//, '').replace('\#\!\/', '');

    window.transition.to(fragment);

    return false

  });

  backbone.history.start({ pushState: true }); 

});
