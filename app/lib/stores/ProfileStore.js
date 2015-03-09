
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Store = require('./Store');

var ProfileStore = new Store({});

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {
    case AppConstants.RECEIVED_PROFILE:
      ProfileStore.set(action.profile);
      break;
    case AppConstants.USER_LOGGED_OUT:
      ProfileStore.set();
      break;
    default:
      // no op
  }
});

module.exports = ProfileStore;
