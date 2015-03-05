var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

module.exports = {

  /**
   * @param  {string} token
   */
  authenticated: function(token) {
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
