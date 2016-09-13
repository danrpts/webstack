var google = require('googleapis');
var client = require('../singletons/google_singleton.js');

module.exports = {

  getAccessToken: function (code, callback) {

    client.getToken(code, function(err, tokens) {
      
      if (!err) {
        client.setCredentials(tokens);
        callback(tokens);
      }

      else {
        console.log(err);
      }

    });

  }

}

