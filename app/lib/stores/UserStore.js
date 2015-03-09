var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var Store = require('./Store');

var UserStore = new Store([]);

// Register callback to handle all updates
Dispatcher.register(function(action) {

  switch(action.actionType) {
    case Constants.RECEIVED_USERS:
      UserStore.set(action.users);
      break;
    case Constants.USER_LOGGED_OUT:
      UserStore.set();
    default:
      // no op
  }
});

module.exports = UserStore;
