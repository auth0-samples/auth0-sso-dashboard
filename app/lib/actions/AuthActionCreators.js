var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AuthActionCreators = {

  /**
   * @param  {string} token
   */
  authenticated: function(token) {
    AppDispatcher.dispatch({
      actionType: AppConstants.USER_AUTHENTICATED,
      token: token
    });
  }

};

module.exports = AuthActionCreators;