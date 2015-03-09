
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Store = require('./Store');

var UserAppStore = new Store([]);

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {
    case AppConstants.RECEIVED_USER_APPS:
      UserAppStore.set(action.apps);
      break;
    case AppConstants.USER_LOGGED_OUT:
      UserAppStore.set();
      break;
    default:
      // no op
  }
});

module.exports = UserAppStore;
