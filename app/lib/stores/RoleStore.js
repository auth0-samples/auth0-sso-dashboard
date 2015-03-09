
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Store = require('./Store');

var RoleStore = new Store([]);

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {
    case AppConstants.RECEIVED_ROLES:
      RoleStore.set(action.roles);
      break;
    case AppConstants.USER_LOGGED_OUT:
      RoleStore.set();
      break;
    default:
      // no op
  }
});

module.exports = RoleStore;
