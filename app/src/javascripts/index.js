'use strict';

var $ = require('jquery');
var backbone = require('backbone');
backbone.LocalStorage = require('backbone.localstorage');
var Transition_Router = require('./routers/Transition_Router.js');

$(function() {

  window.transition = new Transition_Router();

  $(document).on('click', '[href^="/"]', function (event) {

    var href = $(event.currentTarget).attr('href')

    !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey
      && event.preventDefault();

    var fragment = href.replace(/^\//, '').replace('\#\!\/', '');

    window.transition.to(fragment);

    return false

  });

  // TODO:
  // Using { pushState: true } requires thought-out server
  backbone.history.start({ pushState: true }); 

});
