var config = require('../config.json');

module.exports = {

  getConfig: function(name) {
    return config[name];
  },

  getRoles: function() {
    return config.roles;
  },

  getClients: function() {
    return config.clients;
  }
}
