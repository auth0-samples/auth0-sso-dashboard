var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var Store = require('./Store');
var _ = require('lodash');

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
      var roles = RoleStore.get();
      var i = _.findIndex(roles, function(current) {
        return current.id === action.role.id;
      });
      if (i > -1) {
        roles[i] = action.role;
      } else {
        roles.push(action.role)
      }
      RoleStore.set(roles);
    default:
      // no op
  }
});

module.exports = RoleStore;
