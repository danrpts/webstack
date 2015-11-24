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

module.exports = function signinCallback (authResult) {
  if (authResult['code']) {
    var payload = { "authCode": authResult['code'] }

    // set x-csrf-token header on all jqXHR's
    $.ajaxPrefilter(function (options, originalOptions, xhr) {
      var token = getStateToken();
      if (token) {
        xhr.setRequestHeader('x-csrf-token', token);
      } else {
        return false;
      }
    });

    $.ajax({
      type: 'POST',
      url: '/oauth2/google',
      contentType: 'application/json',
      data: JSON.stringify(payload),
      dataType: 'json',
      processData: false,
      success: function (data, status, xhr) {
        $('#signinButton').hide();
        setStateToken(data.stateToken);
        $('body').append('Logged in: ' + data.isFullyLoggedIn);
        console.log(data.user);
      }
    });
  }
}
