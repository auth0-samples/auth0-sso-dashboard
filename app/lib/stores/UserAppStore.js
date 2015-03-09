var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var Store = require('./Store');

var UserAppStore = new Store([]);

// Register callback to handle all updates
Dispatcher.register(function(action) {

  switch(action.actionType) {
    case Constants.RECEIVED_USER_APPS:
      UserAppStore.set(action.apps);
      break;
    case Constants.USER_LOGGED_OUT:
      UserAppStore.set();
      break;
    default:
      // no op
  }
});

module.exports = UserAppStore;
