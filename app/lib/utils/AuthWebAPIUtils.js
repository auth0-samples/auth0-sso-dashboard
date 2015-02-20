var request = require('browser-request');
var ProfileActionCreators = require('../actions/ProfileActionCreators');

module.exports = {

  loadUserProfile: function(token) {
    request({
      url: 'https://' + config.auth0_domain + '/tokeninfo',
      method: 'POST',
      json: {
        id_token: token
      }
    }, function(error, response, body) {
      if (error) {
        throw error;
      } else {
        ProfileActionCreators.recieveProfile(body);
      }
    });
  }

};
