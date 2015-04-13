var API = require('../API');

module.exports = {

  loadRoles: function(aws_credentials) {
    API.loadRoles(aws_credentials);
  },

  save: function(aws_credentials, role) {
    API.saveRole(aws_credentials, role);
  },

  delete: function(aws_credentials, role_id) {
    API.deleteRole(aws_credentials, role_id);
  }

};
