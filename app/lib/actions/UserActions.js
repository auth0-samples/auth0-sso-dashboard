var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var API = require('../API');

module.exports = {

  loadUsers: function(proxy_token) {
    API.loadUsers(proxy_token, {
      per_page: 50,
      page: 0
    });
  },

  saveUserRoles: function(proxy_token, user_id, roles) {
    API.saveUserRoles(proxy_token, user_id, roles);
  }

};
