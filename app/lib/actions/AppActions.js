var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var API = require('../API');

module.exports = {
  loadApps: function(token) {
    API.loadApps(token);
  },

  save: function(token, app) {
    API.saveApp(token, app);
  },

  loadUserApps: function(token) {
    API.loadUserApps(token);
  }
};
