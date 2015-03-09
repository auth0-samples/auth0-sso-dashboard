var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var DataWebAPIUtils = require('../utils/DataWebAPIUtils');

module.exports = {

  /**
   * @param  {object} apps
   */
  receiveUserApps: function(apps) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_USER_APPS,
      apps: apps
    });
  },

  getApps: function(token) {
    DataWebAPIUtils.loadApps(token);
  },
 
  recieveApps: function(apps) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_APPS,
      apps: apps
    });
  }

};
