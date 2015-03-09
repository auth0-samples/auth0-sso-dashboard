var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var DataWebAPIUtils = require('../utils/DataWebAPIUtils');

module.exports = {

  getRoles: function(token) {
    DataWebAPIUtils.loadRoles(token);
  },

  save: function(token, role) {
    DataWebAPIUtils.saveRole(token, role, function(err) {
    });
  }

};
