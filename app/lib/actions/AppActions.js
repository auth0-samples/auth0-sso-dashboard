var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var API = require('../API');

module.exports = {
  getApps: function(token) {
    API.loadApps(token);
  },
};
