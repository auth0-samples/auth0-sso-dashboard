var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var Store = require('./Store');

var ProfileStore = new Store({});

// Register callback to handle all updates
Dispatcher.register(function(action) {

  switch(action.actionType) {
    case Constants.RECEIVED_PROFILE:
      ProfileStore.set(action.profile);
      break;
    case Constants.USER_LOGGED_OUT:
      console.log('loggedout')
      ProfileStore.set();
      break;
    default:
      // no op
  }
});

module.exports = ProfileStore;
