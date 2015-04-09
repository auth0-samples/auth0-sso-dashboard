var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var Store = require('./Store');

var RoleStore = new Store([]);

// Register callback to handle all updates
Dispatcher.register(function(action) {

  switch(action.actionType) {
    case Constants.RECEIVED_ROLES:
      RoleStore.set(action.roles);
      break;
    case Constants.USER_LOGGED_OUT:
      RoleStore.set();
      break;
    case Constants.SAVED_ROLE:
      RoleStore.update(action.role, function(current) {
        return current.id === action.role.id;
      });
      break;
    case Constants.DELETED_ROLE:
      RoleStore.delete(function(current) {
        return current.id === action.role_id;
      });
      break;
    default:
      // no op
  }
});

module.exports = RoleStore; 
