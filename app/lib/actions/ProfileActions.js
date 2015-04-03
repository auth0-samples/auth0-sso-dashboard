var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');

module.exports = {

  init: function() {
    Dispacher.dispatch({
      actionType: Constants.CHECK_AUTHENTICATED
    })
  },

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

  loadProfile: function(profile) {
    Dispatcher.dispatch({
      actionType: Constants.RECEIVED_PROFILE,
      profile: profile
    });
  },

  logout: function() {
    Dispatcher.dispatch({
      actionType: Constants.USER_LOGGED_OUT
    });
  }

};
