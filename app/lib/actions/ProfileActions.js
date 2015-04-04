var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var API = require('../API');

module.exports = {


  loadProfile: function(id_token) {
    API.loadUserProfile(id_token);
  }
  
};
