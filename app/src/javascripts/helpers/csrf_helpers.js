'use strict';
var $ = require('jquery');

/**
 * setStateToken() sets the meta 'state-token' content attribute
 * to be used in the next 'x-csrf-token' header.
 *
 * @param <String> token
 * @throws <Error> w/o token
 */

function setStateToken (token) {
  var err;
  if (typeof token != 'string') {
    err = new Error('Cannot set state without token.');
    err.name = 'InvalidArgumentError';
    return err;
  }
  $('meta[name="state-token"]').attr('content', token);
}

/**
 * getStateToken() gets the meta 'state-token' content attribute
 * to be used in a current 'x-csrf-token' header.
 *
 * @return <String> token
 */

function getStateToken () {
  return $('meta[name="state-token"]').attr('content');
}
