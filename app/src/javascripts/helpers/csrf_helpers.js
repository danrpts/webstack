'use strict';
var $ = require('jquery');

module.exports = {

  /**
   * setStateToken() sets the meta 'state-token' content attribute
   * to be used in the next 'x-csrf-token' header.
   *
   * @param <String> token
   * @throws <Error> w/o token
   */
  setStateToken: function (token) {
    var err;
    if (typeof token != 'string') {
      err = new Error('Cannot set state without token.');
      err.name = 'InvalidArgumentError';
      return err;
    }
    $('meta[name="token"]').attr('content', token);
  }

  /**
   * getStateToken() gets the meta 'state-token' content attribute
   * to be used in a current 'x-csrf-token' header.
   *
   * @return <String> token
   */
  getStateToken: function () {
    return $('meta[name="token"]').attr('content');
  }

}