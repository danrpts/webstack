var google = require('googleapis');
var config = require('../config/google_config.json');
var OAuth2Client = google.auth.OAuth2;

// Since this uses hybrid flow, redirect uri must be set to 'postmessage'
var client = new OAuth2Client(config.client_id, config.client_secret, config.redirect_uri);
module.exports = client;
