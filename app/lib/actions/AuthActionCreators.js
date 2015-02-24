var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var AuthWebAPIUtils = require('../utils/AuthWebAPIUtils');
var DataWebAPIUtils = require('../utils/DataWebAPIUtils');

module.exports = {

  /**
   * @param  {string} token
   */
  authenticated: function(token) {
    AppDispatcher.dispatch({
      actionType: AppConstants.USER_AUTHENTICATED,
      token: token
    });
    AuthWebAPIUtils.loadUserProfile(token);
    DataWebAPIUtils.loadUserApps(token);
  },

  logout: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.USER_LOGGED_OUT
    });
  }

};
