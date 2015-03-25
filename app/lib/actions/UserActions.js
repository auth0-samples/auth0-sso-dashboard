var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var API = require('../API');

module.exports = {

  getUsers: function(token) {
    API.loadUsers(token, {
      per_page: 10,
      page: 0
    });
  },

  saveUserRoles: function(token, user_id, roles) {
    API.saveUserRoles(token, user_id, roles);
  },

  saveUserProfile: function(token, user_id, profile) {
    API.saveUserProfile(token, user_id, profile);
  }

};
