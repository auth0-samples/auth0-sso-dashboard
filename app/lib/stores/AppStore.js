
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Store = require('./Store');

var AppStore = new Store([]);

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {
    case AppConstants.RECEIVED_APPS:
      AppStore.set(action.apps);
      break;
    case AppConstants.USER_LOGGED_OUT:
      AppStore.set();
    default:
      // no op
  }
});

module.exports = AppStore;
