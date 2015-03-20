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
    case Constants.SAVED_USER:
      UserStore.update(action.user, function(current) {
        return current.user_id === action.user.user_id;
      });
      break;
    default:
      // no op
  }
});

module.exports = UserStore;
