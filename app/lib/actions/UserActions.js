var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var API = require('../API');

module.exports = {

  loadUsers: function(proxy_token, options) {
    API.loadUsers(proxy_token, options);
  },

  saveUserRoles: function(proxy_token, user_id, roles) {
    API.saveUserRoles(proxy_token, user_id, roles);
  }

};
