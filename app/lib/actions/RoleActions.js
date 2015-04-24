var API = require('../API');

module.exports = {

  loadRoles: function(token) {
    API.loadRoles(token);
  },

  save: function(token, role) {
    API.saveRole(token, role);
  },

  delete: function(token, role_id) {
    API.deleteRole(token, role_id);
  }

};
