var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var API = require('../API');

module.exports = {

  getRoles: function(token) {
    API.loadRoles(token);
  },

  save: function(token, role) {
    API.saveRole(token, role, function(err) {

    });
  }

};
