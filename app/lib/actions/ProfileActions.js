var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var API = require('../API');

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

  loadProfile: function(token) {
    API.loadUserProfile(token);
  },

  logout: function() {
    Dispatcher.dispatch({
      actionType: Constants.USER_LOGGED_OUT
    });
  }

};
