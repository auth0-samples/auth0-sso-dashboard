var request = require('browser-request');

module.exports = {

  loadSettings = function(token) {
    request({
      url: '/data/settings',
      header: {
        'Authorization': 'Bearer ' + token
      }
    }, function(error, response, body) {
      if (error) {
        throw error;
      } else {
        return JSON.parse(body);
      }
    });
  }

  loadRoles = function(token) {
    request({
      url: '/data/roles',
      header: {
        'Authorization': 'Bearer ' + token
      }
    }, function(error, response, body) {
      if (error) {
        throw error;
      } else {
        return JSON.parse(body);
      }
    });
  }

};
