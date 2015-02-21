var request = require('browser-request');
var AppActionCreators = require('../actions/AppActionCreators');

module.exports = {

  loadUserApps: function(token) {
    request({
      url: '/data/apps',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }, function(error, response, body) {
      if (error) {
        throw error;
      } else {
        var apps = JSON.parse(body);
        AppActionCreators.receiveApps(apps);
      }
    });
  }

};
