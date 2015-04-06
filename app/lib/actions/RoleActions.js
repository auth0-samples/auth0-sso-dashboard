var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var API = require('../API');

module.exports = {

  loadRoles: function(aws_credentials) {
    API.loadRoles(aws_credentials);
  },

  save: function(token, role) {
    API.saveRole(token, role);
  },

  delete: function(token, role_id) {
    API.deleteRole(token, role_id);
  }

};
