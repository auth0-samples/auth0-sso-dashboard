var API = require('../API');

module.exports = {

  loadUsers: function(token, options) {
    API.loadUsers(token, options);
  },

  saveUserRoles: function(token, user_id, roles) {
    API.saveUserRoles(token, user_id, roles);
  }

};
