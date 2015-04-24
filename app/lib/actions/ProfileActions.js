var API = require('../API');

module.exports = {

  loadProfile: function(token, user_id) {
    API.loadUserProfile(token, user_id);
  },

  saveProfile: function(token, user_id, profile) {
    API.saveUserProfile(token, user_id, profile);
  }

};
