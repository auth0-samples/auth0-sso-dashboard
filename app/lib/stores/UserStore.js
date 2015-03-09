
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Store = require('./Store');

var UserStore = new Store([]);

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {
    case AppConstants.RECEIVED_USERS:
      UserStore.set(action.users);
      break;
    case AppConstants.USER_LOGGED_OUT:
      UserStore.set();
    default:
      // no op
  }
});

module.exports = UserStore;
