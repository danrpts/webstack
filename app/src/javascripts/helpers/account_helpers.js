var $ = require('jquery');
var Backbone = require('backbone');

module.exports = {

  signinCallback: function  (authResult) {

    if (authResult['code']) {
      var payload = { "authCode": authResult['code'] }

      /*
      // Set x-csrf-token header on all jqXHR's
      $.ajaxPrefilter(function (options, originalOptions, xhr) {
        var token = getStateToken();
        if (token) {
          xhr.setRequestHeader('x-csrf-token', token);
        } else {
          return false;
        }
      });
      */

      $.ajax({
        type: 'POST',
        url: '/oauth2/google',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        dataType: 'json',
        processData: false,
        success: function (data, status, xhr) {
          //$('#signinButton').hide();
          //setStateToken(data.stateToken);
          //$('body').append('Logged in: ' + data.isFullyLoggedIn);
          console.log(data.user);
        }

      });
    }
  }
}
