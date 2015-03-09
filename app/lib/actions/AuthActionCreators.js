var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var AuthWebAPIUtils = require('../utils/AuthWebAPIUtils');
var DataWebAPIUtils = require('../utils/DataWebAPIUtils');


module.exports = {

  init: function() {
    AppDispacher.dispatch({
      actionType: AppConstants.CHECK_AUTHENTICATED
    })
  },

  /**
   * @param  {string} token
   */
  authenticated: function(token) {
    DataWebAPIUtils.loadUserApps(token);
    AuthWebAPIUtils.loadUserProfile(token);
    AppDispatcher.dispatch({
      actionType: AppConstants.USER_AUTHENTICATED,
      token: token
    });
  },

  logout: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.USER_LOGGED_OUT
    });
  }

};
