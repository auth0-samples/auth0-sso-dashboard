var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var Store = require('./Store');

var AppStore = new Store([]);

// Register callback to handle all updates
Dispatcher.register(function(action) {

  switch(action.actionType) {
    case Constants.RECEIVED_APPS:
      AppStore.set(action.apps);
      break;
    case Constants.USER_LOGGED_OUT:
      AppStore.set();
      break;
    case Constants.SAVED_APP:
      AppStore.update(action.app, function(current) {
        return current.client_id === action.app.client_id;
      });
      break;
    default:
      // no op
  }
});

module.exports = AppStore;
