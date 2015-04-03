var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var API = require('../API');

module.exports = {

  /**
   * @param  {string} token
   */
  authenticated: function(token, task_tokens) {
    Dispatcher.dispatch({
      actionType: Constants.USER_AUTHENTICATED,
      token: token,
      task_tokens: task_tokens
    });
  },

  receiveProfile: function(profile) {
    Dispatcher.dispatch({
      actionType: Constants.RECEIVED_PROFILE,
      profile: profile
    });
  },

  loadProfile: function(token) {
    API.loadUserProfile(token);
  },

  logout: function() {
    Dispatcher.dispatch({
      actionType: Constants.USER_LOGGED_OUT
    });
  }

};
