var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var API = require('../API');

module.exports = {

  loadProfile: function(id_token, user_id) {
    API.loadUserProfile(id_token, user_id);
  },

  saveProfile: function(id_token, user_id, profile) {
    API.saveUserProfile(id_token, user_id, profile);
  }

};
