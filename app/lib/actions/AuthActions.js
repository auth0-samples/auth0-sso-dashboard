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
  authenticated: function(token) {
    //API.loadUserApps(token);
    API.loadUserProfile(token);
    Dispatcher.dispatch({
      actionType: Constants.USER_AUTHENTICATED,
      token: token
    });
  },

  logout: function() {
    Dispatcher.dispatch({
      actionType: Constants.USER_LOGGED_OUT
    });
  }

};
