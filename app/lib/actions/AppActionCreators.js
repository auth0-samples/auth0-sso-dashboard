var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var AuthWebAPIUtils = require('../utils/AuthWebAPIUtils');

module.exports = {

  /**
   * @param  {object} apps
   */
  receiveApps: function(apps) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_APPS,
      apps: apps
    });
  }

};
